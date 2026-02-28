import Hero from "../../components/Hero"
import { useNavigate } from "react-router";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

function HomePage() {
  const address = "Via Str. Vecchia, 8, 31028 TV, Italia";
  const mapUrl = "https://maps.google.com/maps?q=45.8134318,12.3525864&z=18&output=embed";
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">

      {/* Hero */}
      <Hero inputH={100} srcImg="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        altIMg="Mia Romagna" title="Mia Romagna" 
        description="Un ristorante nel cuore della campagna trevigiana, per ogni tua occasione: ricevimenti, battesimi, comunioni, cresime, feste di laurea, pranzi di lavoro o cene intime." />
      {/* Chi siamo */}
      <section className="py-16 px-6 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">La nostra storia</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            La famiglia Sanson sarà lieta di avervi come ospiti in un locale accogliente e familiare.
            Da generazioni portiamo in tavola i sapori autentici della tradizione romagnola,
            con ingredienti freschi e ricette tramandate.
          </p>
        </div>
      </section>

      {/* Orari */}
      <section id="orari" className="py-16 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Orari di apertura</h2>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {[
              { giorno: "Lunedì",    orario: "12:00 – 23:00" },
              { giorno: "Martedì",   orario: "12:00 – 23:00" },
              { giorno: "Mercoledì", orario: "12:00 – 23:00" },
              { giorno: "Giovedì",   orario: "12:00 – 23:00" },
              { giorno: "Venerdì",   orario: "12:00 – 23:00" },
              { giorno: "Sabato",    orario: "12:00 – 23:00" },
              { giorno: "Domenica",  orario: "12:00 – 23:00" },
            ].map(({ giorno, orario }, i) => (
              <div
                key={giorno}
                className={`flex justify-between px-6 py-4 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <span className="font-medium text-gray-700">{giorno}</span>
                <span className="text-amber-600 font-semibold">{orario}</span>
              </div>
            ))}
          </div>
                    <p className="font-semibold text-gray-800">Telefono: +39 350 585 0022</p>
        </div>
      </section>

      {/* Menu */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Il nostro menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { titolo: "Menu del Giorno",   desc: "Piatti freschi preparati ogni giorno con ingredienti di stagione." },
              { titolo: "Menu alla Carta",   desc: "Scegli liberamente tra i nostri classici della tradizione romagnola." },
            ].map(({ titolo, desc }) => (
              <div  onClick={() => navigate("/menu")} key={titolo} className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{titolo}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alloggio */}
      <section className="relative h-96">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src="https://plus.unsplash.com/premium_photo-1675615667752-2ccda7042e7e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&https://plus.unsplash.com/premium_photo-1675615667752-2ccda7042e7e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D://images.unsplash.com/photo-1690983322857-0811d47fedfc?q=80&w=2102&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
             alt="Soggiorno Mia Romagna"/>
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Soggiorna da noi</h2>
            <p className="text-white/80 text-lg mb-6">
              Offriamo anche la possibilità di alloggiare. Vivi un'esperienza completa
              immerso nella tranquillità della campagna trevigiana.
            </p>
            <p
              className="cursor-pointer text-white inline-block px-8 py-3 bg-amber-700 hover:bg-amber-500 font-semibold rounded-full transition-colors"
              onClick={() => navigate("/rooms")}
            >
              Scopri le camere
            </p>
          </div>
      </section>
    <section className="py-12 bg-gray-50">
        <h2 className="text-3xl text-black font-bold mb-6 text-center">Dove Trovarci</h2>
        <div className="overflow-hidden shadow-lg h-96">
          {/* standard per incorporare contenuti esterni */}
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={mapUrl}
          />
        </div>
        <div className="mt-4 text-center">
          <p className="font-semibold">La Mia Romagna</p>
          <p className="text-gray-600">{address}</p>
          <a 
            href="https://www.google.com/maps/place/La+Mia+Romagna/@45.8134967,12.3523602,233m/data=!3m1!1e3!4m6!3m5!1s0x47794194cc5e4af3:0x159b59b8c7b07cbc!8m2!3d45.8134318!4d12.3525864!16s%2Fg%2F11x6dk5vmt?entry=ttu&g_ep=EgoyMDI2MDIyMy4wIKXMDSoASAFQAw%3D%3D" 
            target="_blank" 
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Apri in Google Maps
          </a>
        </div>
    </section>

      {/* Footer */}
    <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm flex flex-col md:flex-row md:justify-between md:items-center md:px-8">
          <p className="font-semibold ">La Mia Romagna</p>
          <p className="font-semibold ">Telefono: +39 350 585 0022</p>
          <p className="font-semibold ">E-mail: </p>
      <div>© {new Date().getFullYear()} Mia Romagna — Tutti i diritti riservati</div>
    </footer>
    </div>
  );
}

export default HomePage;
