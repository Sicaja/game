import { Box } from '@chakra-ui/react';
import { Pipe } from './directionsInterfaces';

interface DraggablePipeProps {
  type: Pipe; // El tipo de la pieza
  children: React.ReactNode; // La representación de la pieza
}

const DraggablePipe: React.FC<DraggablePipeProps> = ({ type, children }) => {
  // Función que maneja el inicio del arrastre
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('pipeType', JSON.stringify(type)); // Guardamos el tipo de la pieza que se arrastra
  };

  return (
    <Box
      draggable
      onDragStart={handleDragStart}
      cursor="grab"
      w="50px"
      h="50px"
      bg="blue.100"
      border="1px solid blue"
    >
      {children} {/* Aquí se muestra la pieza que se arrastra */}
    </Box>
  );
};

export default DraggablePipe;
