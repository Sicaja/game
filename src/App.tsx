import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import Board from './Board';
import DraggablePipe from './Draggable';
import {
  PipeCurve,
  PipeCurveInvert,
  PipeCurveInvertY,
  PipeCurveY,
  PipeHorizontal,
  PipeVertical,
} from './Pieces';
import {
  pipeHorizontal,
  pipeVertical,
  pipeCurve,
  pipeCurveInvert,
  pipeCurveInvertY,
  pipeCurveY,
} from './directionsInterfaces';

function App() {
  return (
    <ChakraProvider>
      <div className="flex gap-5 justify-center">
        <div className="flex flex-col">
          <span className="font-bold text-2xl mb-10">Piezas</span>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex gap-3">
              <span>Horizontal</span>
              <div className="w-full flex justify-end">
                <DraggablePipe type={pipeHorizontal}>
                  <PipeHorizontal invalid={false} />
                </DraggablePipe>
              </div>
            </div>

            <div className="flex gap-3">
              <span>Vertical</span>
              <div className="w-full flex justify-end">
                <DraggablePipe type={pipeVertical}>
                  <PipeVertical invalid={false} />
                </DraggablePipe>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-full">Curva</span>
              <div className="w-full flex justify-end">
                <DraggablePipe type={pipeCurve}>
                  <PipeCurve invalid={false} />
                </DraggablePipe>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-full">Curva invertida</span>
              <div className="w-full flex justify-end">
                <DraggablePipe type={pipeCurveInvert}>
                  <PipeCurveInvert invalid={false} />
                </DraggablePipe>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-full">Curva Y</span>
              <div className="w-full flex justify-end">
                <DraggablePipe type={pipeCurveY}>
                  <PipeCurveY invalid={false} />
                </DraggablePipe>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-full">Curva invertida Y</span>
              <div className="w-full flex justify-end">
                <DraggablePipe type={pipeCurveInvertY}>
                  <PipeCurveInvertY invalid={false} />
                </DraggablePipe>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <Board />
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
