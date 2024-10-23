import { Box } from '@chakra-ui/react';

type PipeProps = {
  invalid: boolean;
  isStart?: string;
};

const PipeHorizontal: React.FC<PipeProps> = ({ invalid }) => (
  <Box
    w="100%"
    h="20%"
    bg={!invalid ? 'blue.400' : 'red.400'}
    border={!invalid ? '1px solid blue' : '1px solid red'}
  />
);

const PipeVertical: React.FC<PipeProps> = ({ invalid }) => (
  <Box
    w="20%"
    h="100%"
    bg={!invalid ? 'blue.400' : 'red.400'}
    border={!invalid ? '1px solid blue' : '1px solid red'}
  />
);

const PipeCurve: React.FC<PipeProps> = ({ invalid }) => (
  <Box w="100%" h="100%" position="relative" bg="transparent">
    {/* Parte horizontal de la L invertida */}
    <Box
      position="absolute"
      top="40%"
      bottom="0"
      left="0"
      w="60%"
      h="20%"
      bg={!invalid ? 'blue.400' : 'red.400'}
      border={!invalid ? '1px solid blue' : '1px solid red'}
    />

    {/* Parte vertical de la L invertida */}
    <Box
      position="absolute"
      bottom="0"
      left="50%"
      transform="translateX(-50%)"
      w="20%"
      h="40%"
      bg={!invalid ? 'blue.400' : 'red.400'}
      border={!invalid ? '1px solid blue' : '1px solid red'}
    />
  </Box>
);

const PipeCurveInvert: React.FC<PipeProps> = ({ invalid }) => (
  <Box w="100%" h="100%" position="relative" bg="transparent">
    {/* Parte horizontal de la L invertida */}
    <Box
      position="absolute"
      top="40%"
      bottom="0"
      right="0"
      w="60%"
      h="20%"
      bg={!invalid ? 'blue.400' : 'red.400'}
      border={!invalid ? '1px solid blue' : '1px solid red'}
    />

    {/* Parte vertical de la L invertida */}
    <Box
      position="absolute"
      bottom="0"
      left="50%"
      transform="translateX(-50%)"
      w="20%"
      h="40%"
      bg={!invalid ? 'blue.400' : 'red.400'}
      border={!invalid ? '1px solid blue' : '1px solid red'}
    />
  </Box>
);

const PipeCurveInvertY: React.FC<PipeProps> = ({ invalid }) => (
  <Box w="100%" h="100%" position="relative" bg="transparent">
    {/* Parte horizontal de la L invertida */}
    <Box
      position="absolute"
      top="40%"
      bottom="0"
      right="0"
      w="60%"
      h="20%"
      bg={!invalid ? 'blue.400' : 'red.400'}
      border={!invalid ? '1px solid blue' : '1px solid red'}
    />

    {/* Parte vertical de la L invertida */}
    <Box
      position="absolute"
      top="0"
      left="50%"
      transform="translateX(-50%)"
      w="20%"
      h="40%"
      bg={!invalid ? 'blue.400' : 'red.400'}
      border={!invalid ? '1px solid blue' : '1px solid red'}
    />
  </Box>
);

const PipeCurveY: React.FC<PipeProps> = ({ invalid }) => (
  <Box w="100%" h="100%" position="relative" bg="transparent">
    {/* Parte horizontal de la L invertida */}
    <Box
      position="absolute"
      top="40%"
      bottom="0"
      left="0"
      w="60%"
      h="20%"
      bg={!invalid ? 'blue.400' : 'red.400'}
      border={!invalid ? '1px solid blue' : '1px solid red'}
    />

    {/* Parte vertical de la L invertida */}
    <Box
      position="absolute"
      top="0"
      left="50%"
      transform="translateX(-50%)"
      w="20%"
      h="40%"
      bg={!invalid ? 'blue.400' : 'red.400'}
      border={!invalid ? '1px solid blue' : '1px solid red'}
    />
  </Box>
);

const PipeCircleEndStart: React.FC<PipeProps> = ({ invalid, isStart }) => (
  <Box
    w="100%"
    h="100%"
    position="relative"
    bg="transparent"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <Box
      w="60%"
      h="60%"
      bg={!invalid ? 'blue.400' : 'red.400'}
      border={!invalid ? '1px solid blue' : '1px solid red'}
      borderRadius="50%"
    >
      {isStart}
    </Box>
  </Box>
);

export {
  PipeHorizontal,
  PipeVertical,
  PipeCurve,
  PipeCurveY,
  PipeCurveInvert,
  PipeCurveInvertY,
  PipeCircleEndStart,
};
