import { useState } from "react";
import "./App.css";
import { AudioBar } from "./audioBar";

function App() {
  const [count, setCount] = useState(50);
  const [gap, setGap] = useState(20);
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(150);
  const heights = Array.from(
    { length: 50 },
    (_, i) => Math.sin(i * 0.3) * 10 + height,
  );
  


  return (
    <>

       <div style={{ marginBottom: "20px" }}>
        <div>
          속도(간격): {gap}
          <input
            type="range"
            min="0"
            max="50"
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
          />
        </div>
        <div>
          크기(높이): {height}
          <input
            type="range"
            min="150"
            max="200"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </div>

        <div>
          목소리 굵기(굵기): {width}
          <input
            type="range"
            min="2"
            max="50"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
          
        </div>
        <div>
          count: {count}
          <input
            type="range"
            min="2"
            max="50"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
          
        </div>
      </div>

      <div
        style={{
          width: "800px",
          height: "800px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "500px",
          overflow: "hidden",
          position:"relative"
        }}
      >
        <div
          style={{
            position:"absolute",
            left:"calc(50% - 50%)",
            top:"calc(50% - 50%)",
            
            width: "600px",
            height: "500px",
            display: "flex",
            gap: `${gap}px`,
          }}
        >
          {Array.from({ length: count }).map((_, index) => (
            <AudioBar key={index} width={width} height={heights[index]} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
