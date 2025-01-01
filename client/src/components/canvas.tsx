import { useState, useEffect } from 'react'
import axios from 'axios';
import '../CSS/canvas.css'
import { HexColorPicker } from "react-colorful";

//interfaces 
type CallbackFunction = (...args:any[]) => void;
interface BitArrayResponse {
  data: string[]; // Or number[] if your API returns numbers
}
interface BgColor {
    backgroundColor: string
}

function Canvas(){
    const [colors, setColors] = useState<string[]>([])
    const [color, setColor] = useState<string>("#aabbcc");
    const [selectedPixel, setSelectedPixel] = useState<number|null>(null)
    useEffect(()=>{
        axios.get(`http://localhost:3000/bitArray`, {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then((res:BitArrayResponse) => {
                console.log(`got info ${res.data.length}`)
                setColors(res.data)
            })
            .catch((err) => console.log(err));
    },[])
    //debounce
    useEffect(() => {
        const delayInput = setTimeout(() => {
            setColors( prev => { 
                console.log(prev)
                if(prev){
                    return prev.map((item, index) =>
                            index === selectedPixel ? color : item
                            );
                }
                return prev
            }
        )}, 500)
        return () => clearTimeout(delayInput)
    },[color])
    useEffect(() => {
        console.log(selectedPixel)
    },[selectedPixel])
    const pixels = () => {
        console.log('pixels is called')
        if(colors && colors?.length > 0){
            return colors.map((item,pos) => {
                const bg_color:BgColor = {
                    backgroundColor : `${item}`
                }
                return <span  key={pos} onClick={() => {setSelectedPixel(pos)}} className={`border border-transparent cursor-pointer hover:border-gray-300 inline-block w-4 h-4 `} style={bg_color}> </span>})
        }else{
            console.log('colors does not exist')
        }
    }
    return <div className='w-full h-full flex justify-center align-center text-center'> 
            <div className='' > 
                <div className='mt-2 p-2 border-[2px] border-black max-w-screen-xl p-1 bg-white flex flex-wrap'>{pixels()}</div> 
            </div> 
              <HexColorPicker className='w-fit m-1 h-fit' color={color} onChange={setColor} />
        </div>
}

export default Canvas;

