import { useState } from 'react';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(CONSENT_KEY));

  if (!visible) return null;

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-900 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="flex-1 text-sm leading-relaxed">
          Questo sito utilizza cookie tecnici e memorizza dati locali strettamente necessari al suo funzionamento.
          Nessun dato viene condiviso con terze parti a fini pubblicitari.{' '}
          <Link to="/privacy" className="underline hover:text-amber-300 font-semibold">
            Informativa sulla Privacy
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm border border-white rounded hover:bg-amber-800 transition-colors"
          >
            Rifiuta
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-white text-amber-900 font-semibold rounded hover:bg-amber-100 transition-colors"
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}
