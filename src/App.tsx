import './App.css'
import NavBar from './components/NavBar'
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen w-full">
      <NavBar/>
      <Outlet/>
    </div>
  )
}

export default App
