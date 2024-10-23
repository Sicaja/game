/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/jsonValidator.ts

import { ResultJsonImport } from './directionsInterfaces';

export const parseJsonValidation = (jsonString: string): ResultJsonImport => {
  let line = 1;
  let column = 0;
  let index = 0;
  const length = jsonString.length;

  /**
   * Recupera el siguiente carácter de la cadena JSON y actualiza la posición actual.
   *
   * @returns {string} El siguiente carácter en la cadena JSON.
   *
   * @remarks
   * Esta función incrementa el `index` para moverse al siguiente carácter. Si el carácter es una nueva línea (`'\n'`),
   * incrementa el contador de `line` y reinicia el contador de `column` a 0. De lo contrario, incrementa el contador de `column`.
   */
  const getNextChar = (): string => {
    const char = jsonString[index];
    if (char === '\n') {
      line++;
      column = 0;
    } else {
      column++;
    }
    index++;
    return char;
  };

  /**
   * Omite los caracteres de espacio en blanco en la cadena JSON.
   *
   * Esta función avanza el índice de la cadena JSON mientras el carácter actual
   * sea un espacio (' '), una nueva línea ('\n') o una tabulación ('\t').
   *
   * @returns {void} No retorna ningún valor.
   */
  const skipWhitespace = (): void => {
    while (
      jsonString[index] === ' ' ||
      jsonString[index] === '\n' ||
      jsonString[index] === '\t'
    ) {
      getNextChar();
    }
  };

  /**
   * Analiza un valor JSON de la cadena de entrada.
   *
   * Esta función determina el tipo del siguiente valor JSON inspeccionando el
   * siguiente carácter en la cadena de entrada y delega el análisis al
   * helper function apropiado basado en el tipo de valor detectado.
   *
   * @returns {any} El valor JSON analizado, que puede ser un objeto, arreglo, cadena, número,
   * booleano o null.
   *
   * @throws {Error} Si se encuentra un token inesperado en la cadena de entrada.
   */
  const parseValue = (): any => {
    skipWhitespace();
    const char = getNextChar();

    if (char === '{') {
      return parseObject();
    } else if (char === '[') {
      return parseArray();
    } else if (char === '"') {
      return parseString();
    } else if (char === '-' || (char >= '0' && char <= '9')) {
      return parseNumber(char);
    } else if (char === 't' || char === 'f' || char === 'n') {
      return parseLiteral(char);
    } else {
      throw new Error(
        `Token inesperado en la línea ${line}, columna ${column}: ${char}`
      );
    }
  };

  /**
   * Analiza una cadena JSON y la convierte en un objeto JavaScript.
   *
   * @returns {any} El objeto JavaScript resultante del análisis de la cadena JSON.
   * @throws {Error} Si se encuentra un carácter inesperado durante el análisis.
   *
   * @remarks
   * Esta función asume que la cadena JSON está bien formada y sigue la sintaxis JSON estándar.
   *
   * @example
   * ```typescript
   * const jsonString = '{"clave": "valor"}';
   * const resultado = parseObject(jsonString);
   * console.log(resultado); // { clave: "valor" }
   * ```
   */
  const parseObject = (): any => {
    const obj: Record<string, any> = {};
    skipWhitespace();
    if (jsonString[index] === '}') {
      getNextChar();
      return obj;
    }
    let parsing = true;

    do {
      skipWhitespace();
      const char = getNextChar();
      if (char !== '"') {
        throw new Error(
          `Se esperaba " en la línea ${line}, columna ${column}, pero se obtuvo ${char}`
        );
      }
      const key = parseString();

      skipWhitespace();
      const colon = getNextChar();
      if (colon !== ':') {
        throw new Error(
          `Se esperaba : en la línea ${line}, columna ${column}, pero se obtuvo ${colon}`
        );
      }

      const value = parseValue();
      obj[key] = value;

      skipWhitespace();
      const nextChar = jsonString[index];
      if (nextChar === ',') {
        getNextChar();
      } else if (nextChar === '}') {
        getNextChar();
        parsing = false; // Salir del bucle
      } else {
        throw new Error(
          `Se esperaba , o } en la línea ${line}, columna ${column}, pero se obtuvo ${nextChar}`
        );
      }
    } while (parsing);
    return obj;
  };

  /**
   * Analiza una cadena JSON y devuelve un arreglo.
   *
   * @returns {any[]} Un arreglo con los valores analizados del JSON.
   * @throws {Error} Si se encuentra un carácter inesperado durante el análisis.
   */
  const parseArray = (): any[] => {
    const arr: any[] = [];
    skipWhitespace();
    if (jsonString[index] === ']') {
      getNextChar();
      return arr;
    }

    let parsing = true;

    while (parsing) {
      const value = parseValue();
      arr.push(value);

      skipWhitespace();
      const nextChar = jsonString[index];
      if (nextChar === ',') {
        getNextChar();
      } else if (nextChar === ']') {
        getNextChar();
        parsing = false; // Salir del bucle
      } else {
        throw new Error(
          `Se esperaba , o ] en la línea ${line}, columna ${column}, pero se obtuvo ${nextChar}`
        );
      }
    }

    return arr;
  };

  /**
   * Analiza una cadena de caracteres JSON y la devuelve como una cadena de texto.
   *
   * @returns {string} La cadena de texto analizada.
   * @throws {Error} Si se encuentra un final inesperado de la entrada en la cadena.
   */
  const parseString = (): string => {
    let result = '';
    let char;
    while (true) {
      char = getNextChar();
      if (char === '"') {
        return result;
      } else if (char === '\\') {
        const nextChar = getNextChar(); // skip escaped character
        result += nextChar;
      } else if (char === undefined) {
        throw new Error(
          `Final inesperado de la entrada en la cadena en la línea ${line}, columna ${column}`
        );
      } else {
        result += char;
      }
    }
  };

  /**
   * Parsea una cadena de caracteres que representa un número y la convierte en un número de punto flotante.
   *
   * @param firstChar - El primer carácter de la cadena que representa el número.
   * @returns El número de punto flotante resultante del parseo de la cadena.
   */
  const parseNumber = (firstChar: string): number => {
    let result = firstChar;
    let char;
    while (
      (char = getNextChar()) &&
      ((char >= '0' && char <= '9') ||
        char === '.' ||
        char === '-' ||
        char === 'e' ||
        char === 'E')
    ) {
      result += char;
    }
    index--; // Retrocede un paso porque tomamos un carácter extra
    return parseFloat(result);
  };

  /**
   * Parsea un literal JSON ('true', 'false' o 'null') a partir de un carácter inicial.
   *
   * @param {string} char - El carácter inicial que indica el literal JSON ('t', 'f' o 'n').
   * @returns {any} - El valor booleano o nulo correspondiente al literal JSON.
   * @throws {Error} - Lanza un error si se encuentra un token inesperado en la cadena JSON.
   */
  const parseLiteral = (char: string): any => {
    const literals: Record<string, any> = { t: 'true', f: 'false', n: 'null' };
    const expected = literals[char];
    for (let i = 1; i < expected.length; i++) {
      if (jsonString[index] !== expected[i]) {
        throw new Error(
          `Token inesperado en la línea ${line}, columna ${column}`
        );
      }
      getNextChar();
    }
    return expected === 'true' ? true : expected === 'false' ? false : null;
  };

  try {
    const result = parseValue();
    skipWhitespace();
    if (index < length) {
      throw new Error(
        `Token inesperado en la línea ${line}, columna ${column}: ${jsonString[index]}`
      );
    }
    return { valid: true, data: result };
  } catch (error: any) {
    return { valid: false, error: `Error: ${error.message}` };
  }
};
