function HomePage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <div className="relative h-[100vh]">
        <img
          src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Mia Romagna"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
            Mia Romagna
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl leading-relaxed">
            Un ristorante nel cuore della campagna trevigiana, per ogni tua occasione:
            ricevimenti, battesimi, comunioni, cresime, feste di laurea, pranzi di lavoro o cene intime.
          </p>
          <a
            href="#orari"
            className="mt-8 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors"
          >
            Scopri di più
          </a>
        </div>
      </div>

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
              <div key={titolo} className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{titolo}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alloggio */}
      <section className="py-16 px-6 bg-amber-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Soggiorna da noi</h2>
          <p className="text-gray-600 text-lg mb-6">
            Offriamo anche la possibilità di alloggiare. Vivi un'esperienza completa
            immerso nella tranquillità della campagna trevigiana.
          </p>
          <a
            href="#"
            className="inline-block px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors"
          >
            Scopri le camere
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
        © {new Date().getFullYear()} Mia Romagna — Tutti i diritti riservati
      </footer>

    </div>
  );
}

export default HomePage;
