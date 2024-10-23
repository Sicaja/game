import { ConfigurationGrid } from './directionsInterfaces';

export const validateJSONGame = (data: ConfigurationGrid): void => {
  // Validar que existan rows y cols
  if (typeof data.rows !== 'number' || typeof data.cols !== 'number') {
    throw new Error(
      'El JSON debe contener los campos "rows" y "cols" con valores numéricos.'
    );
  }

  // Validar que el campo "grid" existe y es un array
  if (!Array.isArray(data.grid)) {
    throw new Error('El JSON debe contener el campo "grid" como un array.');
  }

  // Validar que los elementos del grid sigan la estructura dada
  data.grid.forEach((item, index) => {
    if (item !== null && typeof item !== 'object') {
      throw new Error(
        `El elemento en la posición ${index} del grid no es válido. Debe ser un objeto o null.`
      );
    }

    // Si es un objeto, validar que tenga las propiedades requeridas
    if (item !== null) {
      const allowedProperties = [
        'type',
        'connections',
        'invalidConnection',
        'isStart',
        'isEnd',
      ];
      const itemProperties = Object.keys(item);

      // Validar que no tenga propiedades adicionales
      itemProperties.forEach((prop) => {
        if (!allowedProperties.includes(prop)) {
          throw new Error(
            `El objeto en la posición ${index} del grid tiene una propiedad no permitida: "${prop}".`
          );
        }
      });

      if (
        typeof item.type !== 'string' ||
        !Array.isArray(item.connections) ||
        typeof item.invalidConnection !== 'boolean'
      ) {
        throw new Error(
          `El objeto en la posición ${index} del grid no es válido. Debe tener "type", "connections" y "invalidConnection".`
        );
      }
    }
  });
};
