import React from "react";
import Canvas from "./canvas";

function DrawingLine({lines,ref,handleMouseUp,handleMouseDown,handleMouseMove}){
  const pathData='M ' + lines.x + ' ' + lines.y + ' L ';
  console.log(pathData);
  React.useEffect(()=>{

    const canvas = ref.current;
    const context = canvas.getContext('2d');
    canvas.height = 600;
    canvas.width = 800;
    context.fillRect = '#000000';
    context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
    
    canvas.addEventListener('mousedown',handleMouseDown);
    canvas.addEventListener('mousemove',handleMouseMove);
    canvas.addEventListener('mouseup',handleMouseUp);

    return ()=> {
      canvas.removeEventListener('mousedown',handleMouseDown);
      canvas.removeEventListener('mousemove',handleMouseMove);
      canvas.removeEventListener('mouseup',handleMouseUp);
    };

  },[]);
  return (
    <canvas ref = {ref} d={pathData}/>
  );
}
export default DrawingLine;
