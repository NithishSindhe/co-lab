import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//components 
import Navbar from './components/navbar'
import Home from './components/home'
import Chat from './components/chat'
import Canvas from './components/canvas'
import Kanban from './components/kanban'

function App() {

    return (
    <BrowserRouter>
    <div className="h-screen flex flex-col bg-white text-black"> 
      <Navbar /> 
      <div className="flex-grow overflow-y-auto overflow-scroll"> 
          <Routes>
            <Route path="/" element={<Canvas />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/kanban" element={<Kanban />} />
          </Routes>
      </div>
    </div>
    </BrowserRouter>
      )
}
export default App
