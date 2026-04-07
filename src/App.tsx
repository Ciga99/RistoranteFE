import './App.css'
import NavBar from './components/NavBar'
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen w-full bg-orange-50">
      <NavBar title='La Mia Romagna' navLinks={[{ name: "Home", path: "/" },{ name: "Menu", path: "/menu" },{ name: "Stanze", path: "/rooms" }]}/>
      <Outlet />
    </div>
  )
}

export default App
//TODO - aggiungere calendario per dispondibilita camere
//TODO - npm i react-calendar calednmario per la prenotazione camera 
//TODO - prenotazione tavolo con calendario e orari disponibili
//TODO in caso per i pagamenti si puo usrare Stripe 
//TODO - aggiungere sezione admin per gestire menu e camere (CRUD)
//TODO - aggiungere informatica sui cookies e sulla privacy (GDPR)
//TODO - aggiungere la multilingua (italiano e inglese) con react-i18next
//TODO - aggiungere Agggiuntrer topografia almeno al titotlo in alto 
//TODO - aggiungere animaziononi con framer-motion 
