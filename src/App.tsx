import './App.css'
import NavBar from './components/NavBar'
import HomePage from './pages/home/home'

function App() {
  return (
    <>
    <div className="min-h-screen w-full">
      <NavBar/>
      <HomePage/>
    </div>
    </>
  )
}

export default App