import './App.css'
import Invoice from './components/Invoice/Invoice'
import Login from './components/Login/Login'
import Navbar from './components/Navbar/Navbar'
import Register from './components/Register/Register'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {
  return (
    <>
      <Navbar/>
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Register/>} />    
      <Route path='/login' element={<Login/>} /> 
      <Route path='/invoice' element={<Invoice/>} />
      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
