import Media from "./pages/media/index"
import { useState, useRef } from "react";

function App() {
  const val = useRef('');
  const setVal = (value:string) => {
    val.current = value;
  }
  return (<>
    
    <Media />


    <div>
      <input type="text" onChange={(e) => setVal(e.target.value)}/>
    </div>
  </>);
}



export default App;
