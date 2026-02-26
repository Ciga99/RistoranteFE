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
//TODO - Sistemare  hgero mettre tutto in un unvoc componnte 
//TODO - aggiungere calendario per dispondibilita camere
//TODO - npm i react-calendar calednmario per la prenotazione camera 
//TODO - prenotazione tavolo con calendario e orari disponibili
//TODO in caso per i pagamenti si puo usrare Stripe 