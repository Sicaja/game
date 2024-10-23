// Las direcciones cardinales para las entradas y salidas de las tuberías
// export type Direction = 'up' | 'down' | 'left' | 'right';

export enum Direction {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export interface ConfigurationGrid {
  rows: number;
  cols: number;
  grid: Pipe[];
}

export interface ResultJsonImport {
  valid: boolean;
  error?: string;
  data?: ConfigurationGrid;
}

// Definimos un tipo para las piezas de tubería, con sus conexiones
export interface Pipe {
  type:
    | 'startEnd'
    | 'horizontal'
    | 'vertical'
    | 'curve'
    | 'curveInvert'
    | 'curveInvertY'
    | 'curveY'; // El tipo de la tubería
  connections: Direction[]; // Lista de conexiones (por ejemplo, ["left", "right"] para una tubería horizontal)
  invalidConnection: boolean;
  isStart?: boolean;
  isEnd?: boolean;
}

// Ejemplo de una tubería horizontal
export const pipeHorizontal: Pipe = {
  type: 'horizontal',
  connections: [Direction.LEFT, Direction.RIGHT],
  invalidConnection: false,
};

// Ejemplo de una tubería vertical
export const pipeVertical: Pipe = {
  type: 'vertical',
  connections: [Direction.UP, Direction.DOWN],
  invalidConnection: false,
};

// Ejemplo de una tubería curva
export const pipeCurve: Pipe = {
  type: 'curve',
  connections: [Direction.LEFT, Direction.DOWN], // Las conexiones para una tubería curva
  invalidConnection: false,
};

// Ejemplo de una tubería curva
export const pipeCurveInvert: Pipe = {
  type: 'curveInvert',
  connections: [Direction.RIGHT, Direction.DOWN], // Las conexiones para una tubería curva
  invalidConnection: false,
};

// Ejemplo de una tubería curva
export const pipeCurveInvertY: Pipe = {
  type: 'curveInvertY',
  connections: [Direction.UP, Direction.RIGHT], // Las conexiones para una tubería curva
  invalidConnection: false,
};

// Ejemplo de una tubería curva
export const pipeCurveY: Pipe = {
  type: 'curveY',
  connections: [Direction.UP, Direction.LEFT], // Las conexiones para una tubería curva
  invalidConnection: false,
};

// Ejemplo de una tubería de inicio y fin
export const pipeStart: Pipe = {
  type: 'startEnd',
  connections: [Direction.RIGHT],
  invalidConnection: false,
  isStart: true,
};

// Ejemplo de una tubería de inicio y fin
export const pipeEnd: Pipe = {
  type: 'startEnd',
  connections: [Direction.LEFT, Direction.RIGHT, Direction.UP, Direction.DOWN],
  invalidConnection: false,
  isEnd: true,
};
