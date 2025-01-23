import { useState, useEffect } from 'react'
import React from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../CSS/canvas.css'
import { HexColorPicker } from "react-colorful";
import { Rnd } from 'react-rnd'
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";

//interfaces 
import type { RootState } from '../store';
type Key = `${string},${string}`
interface BitArrayResponse {
    data: {colors:string[][]}; // Or number[] if your API returns numbers
}

const Canvas = ():React.ReactElement => {
    const loginStatus: Boolean = useSelector((state: RootState) => state.loginStatus);
    const blanks:string[][] = new Array(10).fill('#000000').map(() => new Array(10).fill('#000000'))
    const [colors, setColors] = useState<string[][]>(blanks)
    const [color, setColor] = useState<string>("#aabbcc");
    //const [debouncedColors, setDebouncedColors] = useState<string[]>(colors);
    const [selectedPixel, setSelectedPixel] = useState<[number,number]|null>(null)
    //const Span = memo(( item:any ) => <span>{item}</span>);
    useEffect(()=>{
        axios.get(`http://localhost:3000/bitArray`, {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then((res:BitArrayResponse) => {
                setColors(res.data.colors)
            })
            .catch((err) => console.log(err));
    },[])
    //debounce
    useEffect(() => {
        const delayInput = setTimeout(() => {
            if(selectedPixel){
                const updatedArray = colors.map((row, rIndex) => row.map((item, cIndex) => rIndex === selectedPixel[0] && cIndex === selectedPixel[1] ? color : item));
                setColors(updatedArray)
            }
        }, 500)
        return () => clearTimeout(delayInput)
    },[color])
    //useEffect(() => {
    //    const delayInput = setTimeout(() => {
    //        setDebouncedColors(colors)
    //    }, 500)
    //    return () => clearTimeout(delayInput)
    //},[color])
    const handlePxlSelect = (key:Key) => {
        const [row, column] = key.split(",");
        const something:[number,number] = [parseInt(row,10),parseInt(column,10)]
        setSelectedPixel(something)
    }
    const line = (row: string[], i: number) => {
      return row.map((column, j) => {
    	const bg_color: React.CSSProperties = {
    	  backgroundColor: column,
    	};
    	const key:Key = `${i},${j}`;
    	return (
    	  <span
    		key={key}
    		onClick={() => handlePxlSelect(key)}
    		style={bg_color}
    		tabIndex={0}
    		className="h-3 w-3 cursor-pointer hover:outline hover:outline-white hover:outline-1 focus:outline focus:outline-white focus:outline-1"
    	  ></span>
    	);
      });
    };
	const Controls:React.FC = () => {
	  const { zoomIn, zoomOut, resetTransform } = useControls();
	  return (
		<div className="">
		  <button className='mx-1 my-1 backdrop-blur-sm bg-black text-white' onClick={() => zoomIn()}>Zoom in</button>
		  <button className='mx-1 my-1 backdrop-blur-sm bg-black text-white' onClick={() => zoomOut()}>Zoom out</button>
		  <button className='mx-1 my-1 backdrop-blur-sm bg-black text-white' onClick={() => resetTransform()}>Reset</button>
		</div>
	  );
	};
    const Pixels:React.FC = () => {
      if (colors && colors.length > 0) {
    	return colors.map((row, i) => (
    	  <div key={i} className="flex">
    		{line(row, i)}
    	  </div>
    	));
      } else {
    	console.log("colors does not exist");
    	return <div>Seeems like canvas is unavailable at the moment</div>; 
      }
    };
	return <div className='border-black border-2 '> 
        <TransformWrapper
            initialScale={1}
            initialPositionX={0}
            initialPositionY={0}
            maxScale={2}
            minScale={0.25}
        >
			<Controls/>
            <div className='border-red-500 border-2 w-fit h-fit '>
            <TransformComponent  >
                <div className='border-black border-2 flex flex-col overflow-hide'>
                <Pixels/>
                </div>
            </TransformComponent>
            </div>
        </TransformWrapper>
    </div>
    return <div className='flex flex-col'> 
	<div className="w-[700px] h-[700px] relative overflow-auto"> 
      <Rnd
        className="w-fit h-fit absolute " 
        default={{ x: 0, y: 0, width:'auto', height:'auto'}}
        bounds="parent" 
      >
        <div><Pixels/></div>
      </Rnd>
    </div>
        <div className='w-fit h-fit'> 
            <HexColorPicker className='w-fit m-1 h-fit' color={color} onChange={setColor} />
        </div>
    </div>
}

export default Canvas;

