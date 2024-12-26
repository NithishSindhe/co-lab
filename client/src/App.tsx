import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';


//components 
//import TreeExample from './components/folderTree'
import Navbar from './components/navbar'

//actions 

//types and interfaces 

function App() {

    //const responseMessage = (response) => {
    //    console.log(response);
    //    return <TreeExample data={data}/>
    //};
    //@ts-ignore
    const errorMessage = (error:unknown) => {
        console.log(error);
    };
    //@ts-ignore
    const data = {
        name: 'root',
        toggled: true,
        children: [
            {
                name: 'parent',
                children: [
                    { name: 'child1' },
                    { name: 'child2' }
                ]
            },
            {
                name: 'loading parent',
                loading: true,
                children: []
            },
            {
                name: 'parent',
                children: [
                    {
                        name: 'nested parent',
                        children: [
                            { name: 'nested child 1' },
                            { name: 'nested child 2' }
                        ]
                    }
                ]
            }
        ]
    };
    const Main_page = () => {
        return <>
            <h1 className='text-slate-950 bold'>Welcome to CoLab</h1>
        </>
    }
    return (
    <div className='h-full w-full bg-white'>
        <Navbar/>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Main_page/>} />
          </Routes>
        </BrowserRouter>
    </div>
      )
}
//{main_page()}
export default App
