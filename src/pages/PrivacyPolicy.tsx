export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-amber-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
        Informativa sulla Privacy
      </h1>
      <p className="text-sm text-gray-500 mb-8">Ultimo aggiornamento: aprile 2025</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-700 mb-3">1. Titolare del trattamento</h2>
        <p className="text-sm leading-relaxed">
          Il titolare del trattamento dei dati personali è <strong>Ristorante</strong>, raggiungibile
          all'indirizzo email indicato nella sezione contatti del sito.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-700 mb-3">2. Dati raccolti e tecnologie utilizzate</h2>
        <p className="text-sm leading-relaxed mb-3">
          Il sito utilizza esclusivamente tecnologie di memorizzazione locale (<em>localStorage</em>) strettamente
          necessarie al suo funzionamento:
        </p>
        <ul className="list-disc list-inside text-sm space-y-2 ml-2">
          <li>
            <strong>Token di autenticazione</strong> — memorizzato nel localStorage del browser per mantenere la
            sessione dell'utente autenticato (area amministrativa). Viene eliminato al logout.
          </li>
          <li>
            <strong>Preferenza cookie</strong> (<code>cookie_consent</code>) — memorizza la scelta dell'utente
            riguardo all'informativa presente sul sito.
          </li>
        </ul>
        <p className="text-sm leading-relaxed mt-3">
          Il sito <strong>non utilizza cookie di profilazione</strong>, cookie di terze parti né strumenti di
          tracciamento analitici.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-700 mb-3">3. Finalità del trattamento</h2>
        <ul className="list-disc list-inside text-sm space-y-2 ml-2">
          <li>Garantire il corretto funzionamento del sito e dell'area riservata.</li>
          <li>Ricordare la preferenza espressa dall'utente in merito all'informativa cookie.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-700 mb-3">4. Base giuridica</h2>
        <p className="text-sm leading-relaxed">
          Il trattamento si basa sul <strong>legittimo interesse</strong> del titolare al corretto funzionamento
          del servizio (art. 6, par. 1, lett. f del GDPR) e sul <strong>consenso</strong> dell'utente per la
          memorizzazione della preferenza cookie (art. 6, par. 1, lett. a del GDPR).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-700 mb-3">5. Conservazione dei dati</h2>
        <p className="text-sm leading-relaxed">
          I dati memorizzati nel localStorage rimangono sul dispositivo dell'utente finché non vengono
          eliminati manualmente o tramite le funzioni del browser. Non vengono trasmessi a server esterni
          al di fuori delle normali chiamate API necessarie all'autenticazione.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-700 mb-3">6. Diritti dell'utente</h2>
        <p className="text-sm leading-relaxed mb-3">
          In conformità al GDPR (artt. 15–22), l'utente ha diritto di:
        </p>
        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
          <li>Accedere ai propri dati personali.</li>
          <li>Ottenerne la rettifica o la cancellazione.</li>
          <li>Opporsi al trattamento o richiederne la limitazione.</li>
          <li>Revocare il consenso in qualsiasi momento, senza pregiudicare la liceità del trattamento precedente.</li>
          <li>Proporre reclamo all'Autorità Garante per la protezione dei dati personali (www.garanteprivacy.it).</li>
        </ul>
        <p className="text-sm leading-relaxed mt-3">
          Per esercitare i propri diritti o revocare il consenso è possibile cancellare i dati memorizzati
          tramite le impostazioni del proprio browser, oppure contattare il titolare del trattamento.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-700 mb-3">7. Modifiche alla presente informativa</h2>
        <p className="text-sm leading-relaxed">
          Il titolare si riserva il diritto di aggiornare la presente informativa. Le modifiche saranno
          pubblicate su questa pagina con indicazione della data di aggiornamento.
        </p>
      </section>
    </div>
  );
}
