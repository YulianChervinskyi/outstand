import React from 'react';
import './App.css';
import {Box} from "./Box";

function App() {
  const [boxes, setBoxes] = React.useState([] as JSX.Element[]) as [JSX.Element[], (boxes: JSX.Element[]) => void];

  const handleClick = (e: React.MouseEvent) =>
  {
      const newBox = <Box
          x={e.clientX}
          y={e.clientY}
          width={50}
          height={50}
          text={`${Math.round(e.clientX/e.clientY)}`}
          onClick={(e) => {e.stopPropagation();}}
      />;

      setBoxes([...boxes, newBox]);
  }

  return (
    <div className="App" onClick={handleClick}>
        {boxes}
    </div>
  );
}

export default App;