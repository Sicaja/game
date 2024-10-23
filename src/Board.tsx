import { Box, Button, Grid, Input } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import {
  PipeCircleEndStart,
  PipeCurve,
  PipeCurveInvert,
  PipeCurveInvertY,
  PipeCurveY,
  PipeHorizontal,
  PipeVertical,
} from './Pieces';
import { Direction, Pipe, ResultJsonImport } from './directionsInterfaces';
import { parseJsonValidation } from './validatorParseJson';
import { validateJSONGame } from './validatorModelGame';
// Definimos los tipos de tuberías
type PipeType = Pipe | null;

const Board = () => {
  const rows = 5;
  const cols = 5;

  // Definimos el estado del tablero, inicializando con casillas vacías (null)
  const [grid, setGrid] = useState<PipeType[]>(Array(rows * cols).fill(null));
  const [shouldSimulate, setShouldSimulate] = useState(true); // Estado adicional

  // Función para manejar la colocación de las piezas en el tablero
  const handleDrop = useCallback(
    (index: number, pipeType: string, log?: string) => {
      const newGrid = [...grid];
      newGrid[index] = jsonParsePiece(pipeType);
      setGrid(newGrid);
      setShouldSimulate(false); // Evita que se ejecute la simulación

      console.log({ log });
      console.log(pipeType);
    },
    [grid]
  );

  // Función para verificar si dos tuberías están conectadas correctamente
  const areConnected = (
    pipeA: Pipe,
    pipeB: Pipe,
    direction: Direction
  ): boolean => {
    const oppositeDirection: { [key in Direction]: Direction } = {
      up: Direction.DOWN,
      down: Direction.UP,
      left: Direction.RIGHT,
      right: Direction.LEFT,
    };

    // Verificamos si la tubería A tiene una conexión en 'direction' y si la tubería B
    // tiene una conexión en la dirección opuesta
    return (
      pipeA.connections.includes(direction) &&
      pipeB.connections.includes(oppositeDirection[direction])
    );
  };

  const clearInvalidConnections = useCallback(() => {
    const newGrid = grid.map((pipe) => {
      if (!pipe) return null;
      return { ...pipe, invalidConnection: false };
    });

    setShouldSimulate(true);
    setGrid(newGrid);
  }, [grid]);

  const calculateStartEnd = useCallback(() => {
    const start = grid.findIndex(
      (pipe) => pipe?.type === 'startEnd' && pipe.isStart
    );
    const end = grid.findIndex(
      (pipe) => pipe?.type === 'startEnd' && pipe.isEnd
    );
    const rowStart = Math.floor(start / cols);
    const colStart = start % cols;

    const rowEnd = Math.floor(end / cols);
    const colEnd = end % cols;

    console.log({ rowEnd, colEnd });

    return { rowStart, colStart, rowEnd, colEnd };
  }, [grid]);

  const getStartDirection = useCallback(() => {
    const start = grid.findIndex(
      (pipe) => pipe?.type === 'startEnd' && pipe.isStart
    );
    const direction = grid[start]?.connections[0];

    return direction;
  }, [grid]);

  const simulateWaterFlow = useCallback((): boolean => {
    // Empezamos desde la posición del grifo (0, 0)
    // let position = { row: 0, col: 0 };
    let position = {
      row: calculateStartEnd().rowStart,
      col: calculateStartEnd().colStart,
    };

    const positionEnd = {
      row: calculateStartEnd().rowEnd,
      col: calculateStartEnd().colEnd,
    };

    let direction: Direction = getStartDirection() ?? Direction.RIGHT; // El flujo de agua comienza hacia la derecha

    console.log({ positionEnd }, { direction });
    while (true) {
      const index = position.row * cols + position.col;
      const currentPipe = grid[index];

      // Si no hay tubería en la posición actual, detenemos el flujo
      if (!currentPipe) return false;

      // Verificamos si hemos llegado al balde (por ejemplo, en la posición (7, 7))
      if (
        position.row === positionEnd.row &&
        position.col === positionEnd.col
      ) {
        alert('¡El agua ha llegado al balde!');
        console.log('¡El agua ha llegado al balde!');

        return true; // El agua ha llegado al balde
      }

      // Buscamos la siguiente tubería en la dirección actual
      let nextPosition;
      switch (direction as Direction) {
        case 'up':
          nextPosition = { row: position.row - 1, col: position.col };
          break;
        case 'down':
          nextPosition = { row: position.row + 1, col: position.col };
          break;
        case 'left':
          nextPosition = { row: position.row, col: position.col - 1 };
          break;
        case 'right':
          nextPosition = { row: position.row, col: position.col + 1 };
          break;
      }

      // Verificamos que la siguiente posición está dentro de los límites del tablero
      if (
        nextPosition!.row < 0 ||
        nextPosition!.row >= rows ||
        nextPosition!.col < 0 ||
        nextPosition!.col >= cols
      ) {
        return false; // El flujo de agua salió del tablero, error
      }

      const nextIndex = nextPosition!.row * cols + nextPosition!.col;
      const nextPipe = grid[nextIndex];

      // Verificamos si las tuberías están conectadas correctamente
      if (nextPipe && areConnected(currentPipe, nextPipe, direction)) {
        // Si están conectadas, seguimos al siguiente paso
        position = nextPosition!;

        // Cambiamos la dirección según la conexión de la siguiente tubería
        switch (nextPipe.type) {
          case 'curve':
            // Si la tubería es curva, ajustamos la dirección
            switch (direction) {
              case Direction.RIGHT:
                direction = Direction.DOWN;
                break;
              case Direction.DOWN:
                direction = Direction.LEFT;
                break;
              case Direction.UP:
                direction = Direction.LEFT;
                break;
              // Otras direcciones de curva pueden manejarse aquí...
            }
            break;

          case 'curveInvert':
            // Si la tubería es curva invertida, ajustamos la dirección
            if (direction === Direction.LEFT) {
              direction = Direction.DOWN;
            } else if (direction === Direction.UP) {
              direction = Direction.RIGHT;
            }
            break;

          case 'curveInvertY':
            switch (direction) {
              case Direction.UP as Direction:
                direction = Direction.LEFT;
                break;
              case Direction.LEFT:
                direction = Direction.UP;
                break;
              case Direction.DOWN:
                direction = Direction.RIGHT;
                break;
            }
            break;

          case 'curveY':
            switch (direction) {
              case Direction.UP as Direction:
                direction = Direction.RIGHT;
                break;
              case Direction.RIGHT:
                direction = Direction.UP;
                break;
              case Direction.DOWN:
                direction = Direction.LEFT;
                break;
            }
            break;

          // Puedes agregar más casos aquí si tienes más tipos de tuberías
        }
      } else {
        // Si las tuberías no están conectadas correctamente, detenemos el flujo
        handleDrop(
          index,
          JSON.stringify({ ...currentPipe, invalidConnection: true })
        );
        setShouldSimulate(false); // Detenemos la simulación
        return false; // Las tuberías no están conectadas correctamente
      }
    }
  }, [cols, grid, rows, handleDrop, calculateStartEnd, getStartDirection]);

  const jsonParsePiece = (piece: string): Pipe | null => {
    if (!piece) return null;
    return JSON.parse(piece);
  };

  const saveGamePlay = () => {
    const gamePlay = {
      grid,
      rows,
      cols,
    };

    localStorage.setItem('gamePlay', JSON.stringify(gamePlay));
    const fileTxt = new File([JSON.stringify(gamePlay)], 'gamePlay.json', {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(fileTxt);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gamePlay.json';
    a.click();
  };

  const getFileJson = (file: File): Promise<ResultJsonImport> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = e.target?.result as string;
        const resultValidation = parseJsonValidation(json);
        console.log(resultValidation);

        if (resultValidation.valid) {
          resolve(resultValidation);
        } else {
          reject(resultValidation.error);
        }
      };

      reader.onerror = (e) => {
        reject(`Error al leer el archivo: ${e}`);
      };

      reader.readAsText(file);
    });
  };

  // Ejecutamos la simulación cuando el grid cambie, pero solo si shouldSimulate es true
  useEffect(() => {
    if (shouldSimulate) {
      simulateWaterFlow();
      // calculateStartEnd();
    }
  }, [grid, shouldSimulate, simulateWaterFlow]);

  return (
    <div className="flex flex-col gap-5">
      <Grid
        templateColumns={`repeat(${cols}, 1fr)`}
        templateRows={`repeat(${rows}, 1fr)`}
        gap={0.5}
        w="31.25rem"
        h="31.25rem"
        bg="gray.200"
        border="1px solid black"
      >
        {grid.map((pipe, idx) => (
          <Box
            key={idx}
            w="100%"
            h="100%"
            bg="white"
            border="1px solid gray"
            display="flex"
            alignItems="center"
            justifyContent="center"
            onDrop={(e) => handleDrop(idx, e.dataTransfer.getData('pipeType'))}
            onDragOver={(e) => e.preventDefault()}
          >
            {pipe?.type === 'startEnd' && (
              <PipeCircleEndStart
                invalid={false}
                isStart={pipe.isStart ? 'Inicio' : 'Final'}
              />
            )}
            {pipe?.type === 'horizontal' && (
              <PipeHorizontal invalid={pipe.invalidConnection} />
            )}
            {pipe?.type === 'vertical' && (
              <PipeVertical invalid={pipe.invalidConnection} />
            )}
            {pipe?.type === 'curve' && (
              <PipeCurve invalid={pipe.invalidConnection} />
            )}
            {pipe?.type === 'curveInvert' && (
              <PipeCurveInvert invalid={pipe.invalidConnection} />
            )}

            {pipe?.type === 'curveInvertY' && (
              <PipeCurveInvertY invalid={pipe.invalidConnection} />
            )}
            {pipe?.type === 'curveY' && (
              <PipeCurveY invalid={pipe.invalidConnection} />
            )}
          </Box>
        ))}
      </Grid>
      <span>Direccion del agua: {getStartDirection()}</span>

      <Button
        colorScheme="cyan"
        onClick={() => {
          saveGamePlay();
        }}
      >
        Guardar partida
      </Button>
      <Button
        colorScheme="cyan"
        onClick={() => {
          clearInvalidConnections();
          // simulateWaterFlow();
        }}
      >
        Jugar
      </Button>
      <Input
        placeholder="Seleccionar partida"
        size="md"
        type="file"
        accept=".json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          getFileJson(file)
            .then((result) => {
              if (result.data) {
                try {
                  validateJSONGame(result.data);
                  setGrid(result.data.grid);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                  alert(error.message);
                }
              }
            })
            .catch((error) => {
              alert(error);
            });
        }}
      />
    </div>
  );
};

export default Board;
