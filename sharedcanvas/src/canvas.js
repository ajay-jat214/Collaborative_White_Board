import React,{useRef,useEffect,useState} from "react";
import DrawingLine from "./drawingLine";
import {List} from "immutable";
import rough from 'roughjs/bundled/rough.esm';
import io from "socket.io-client";

//Global Variables//
const gen = rough.generator();
var boundingRect;
let socket,email;
  let canvass;
const ENDPOINT = "http://localhost:3001"
/////////////

const createElement = (x1,y1,x2,y2) =>{
  const roughEle = gen.line(x1-boundingRect.left,y1-boundingRect.top,x2-boundingRect.left,y2-boundingRect.top);
  return {x1,y1,x2,y2,roughEle};
};

const Canvas = props =>{

  const [lines,setLines]=useState([]);
  const canvasRef = useRef(null);
  socket=io(ENDPOINT, { transports: ['websocket']});

  useEffect(()=>{
    let isDrawing=false;
    const canvas = canvasRef.current;
    const current = {
	    color : 'red',
    };
    const context = canvas.getContext('2d');
    boundingRect=canvas.getBoundingClientRect();
    context.fillStyle = "#8ED6FF";
    canvas.height = 600;
    canvas.width = 800;
    const draww = (x0,y0,x1,y1,color) =>{
	if(x0!=undefined & y0!=undefined & x1!=undefined & y1!=undefined)
        context.moveTo(x0-boundingRect.left,y0+boundingRect.top);
        context.lineTo(x1-boundingRect.left,y1+boundingRect.top);
	context.strokeStyle = color;
	context.stroke();
        context.lineWidth=2;
        context.closePath();
    }

    const startDrawing = e => {
      current.x=e.clientX;
      current.y=e.clientY;
      const {clientX,clientY} = e;
      socket.emit("sharingCanvas",{email:email,x0:clientX,y0:clientY,x1:clientX,y1:clientY,color:"red"});
      isDrawing=true;
      const updateEle = createElement(clientX,clientY,clientX,clientY);
      const index = lines.length;
      const newArr = [...lines];
    };
    const draw = e => {
      if(!isDrawing)return ;
      var index = lines.length-1;
      const {clientX,clientY}=e;
      draww(current.x,current.y,clientX,clientY,"red");
      socket.emit("sharingCanvas",{email:email,x0:current.x,y0:current.y,x1:clientX,y1:clientY,color:"red"});
      current.x=clientX;
      current.y=clientY;
    };
    const stopDrawing = e => {
      isDrawing=false;
    };

    canvas.addEventListener('mousedown',startDrawing,false);
    canvas.addEventListener('mousemove',draw,false);
    canvas.addEventListener('mouseup',stopDrawing,false);
    socket=io(ENDPOINT, { transports: ['websocket']});
    //socket.emit("join",{name:"ajay",email:email});
    socket.on("sharedCanvas",(obj)=>{
      draww(obj.x0,obj.y0,obj.x1,obj.y1,obj.color);
    });
  },[]);

  const call = ()=>{
    email = prompt("enter email");
    socket.emit("join",{name:"ajay",email:email});
  }

  return(
    <div>
    <button onClick={call}>Click me</button>
    <canvas 
      ref = {canvasRef}
      height= {window.innerWidth}
      width = {window.innerWidth}
    />
    </div>
  );

}

export default Canvas;
