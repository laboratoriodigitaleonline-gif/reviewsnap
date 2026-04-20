'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import SiteFooter from '@/components/SiteFooter';

const CONTACT = 'privacy@reviewsnap.net';
const SITE = 'https://reviewsnap.net';
const UPDATED = 'April 2026';
const UPDATED_IT = 'Aprile 2026';

export default function PrivacyPage() {
  const { locale } = useLanguage();
  const it = locale === 'it';

  const sections = it ? [
    {
      title: 'Titolare del trattamento',
      body: `ReviewSnap è gestito da un operatore indipendente. Per qualsiasi richiesta relativa alla privacy, scrivere a: ${CONTACT}`,
    },
    {
      title: 'Dati raccolti',
      body: `ReviewSnap non raccoglie dati personali. Non è richiesta registrazione. L'unico dato che elaboriamo è l'URL del prodotto Amazon che l'utente incolla volontariamente per richiedere un'analisi. Questo URL viene utilizzato esclusivamente per recuperare la pagina pubblica del prodotto e non viene associato a nessun profilo utente.`,
    },
    {
      title: 'Cookie e archiviazione locale',
      body: `Non utilizziamo cookie di tracciamento o cookie di terze parti per finalità pubblicitarie. Il sito utilizza sessionStorage del browser unicamente per trasferire il risultato dell'analisi dalla pagina di caricamento alla pagina dei risultati. Questi dati vengono cancellati automaticamente alla chiusura della scheda. Potremmo utilizzare cookie tecnici strettamente necessari al funzionamento del sito (es. preferenza della lingua salvata in localStorage).`,
    },
    {
      title: 'Servizi di terze parti',
      body: `Per erogare il servizio utilizziamo:\n• Anthropic (Claude AI) – per generare l'analisi delle recensioni. L'URL del prodotto viene inviato all'API di Anthropic.\n• ScraperAPI – per recuperare le pagine pubbliche di Amazon.\n• Vercel – per l'hosting del sito.\n• Upstash Redis – per la memorizzazione delle analisi completate.\nTutti i fornitori trattano i dati in conformità con le rispettive informative sulla privacy.`,
    },
    {
      title: 'Link di affiliazione',
      body: `ReviewSnap partecipa al Programma di affiliazione Amazon. I link verso i prodotti Amazon presenti sul sito possono generare una commissione per ReviewSnap senza alcun costo aggiuntivo per l'utente. La partecipazione al programma di affiliazione non influenza in alcun modo l'analisi AI né i verdetti mostrati.`,
    },
    {
      title: 'Diritti degli utenti (GDPR)',
      body: `In conformità al Regolamento UE 2016/679 (GDPR), gli utenti residenti nell'Unione Europea hanno il diritto di: accedere ai propri dati, richiederne la cancellazione, opporsi al trattamento, richiedere la portabilità dei dati. Poiché non raccogliamo dati personali identificabili, tali diritti si applicano in misura limitata. Per qualsiasi richiesta, contattare: ${CONTACT}`,
    },
    {
      title: 'Sicurezza',
      body: `Il sito è ospitato su infrastruttura sicura (Vercel) con HTTPS obbligatorio. Non memorizziamo password, dati di pagamento o informazioni sensibili degli utenti.`,
    },
    {
      title: 'Modifiche alla privacy policy',
      body: `Ci riserviamo il diritto di aggiornare la presente informativa. Le modifiche saranno pubblicate su questa pagina con l'indicazione della data di aggiornamento.`,
    },
  ] : [
    {
      title: 'Data Controller',
      body: `ReviewSnap is operated by an independent operator. For any privacy-related requests, please contact: ${CONTACT}`,
    },
    {
      title: 'Data We Collect',
      body: `ReviewSnap does not collect personal data. No registration is required. The only data we process is the Amazon product URL that you voluntarily paste to request an analysis. This URL is used solely to retrieve the public product page and is not associated with any user profile.`,
    },
    {
      title: 'Cookies and Local Storage',
      body: `We do not use tracking cookies or third-party advertising cookies. The site uses browser sessionStorage solely to transfer analysis results between the loading page and the results page. This data is automatically deleted when the tab is closed. We may use strictly necessary technical cookies (e.g. language preference stored in localStorage).`,
    },
    {
      title: 'Third-Party Services',
      body: `To provide the service we use:\n• Anthropic (Claude AI) – to generate review analysis. The product URL is sent to the Anthropic API.\n• ScraperAPI – to retrieve public Amazon product pages.\n• Vercel – for site hosting.\n• Upstash Redis – for storing completed analyses.\nAll providers process data in accordance with their respective privacy policies.`,
    },
    {
      title: 'Affiliate Links',
      body: `ReviewSnap participates in the Amazon Associates affiliate program. Product links on this site may earn ReviewSnap a commission at no extra cost to you. Participation in the affiliate program does not influence AI analysis or the verdicts shown.`,
    },
    {
      title: 'User Rights (GDPR)',
      body: `In accordance with EU Regulation 2016/679 (GDPR), users residing in the European Union have the right to: access their data, request its deletion, object to processing, and request data portability. Since we do not collect identifiable personal data, these rights apply in a limited scope. For any requests, contact: ${CONTACT}`,
    },
    {
      title: 'Security',
      body: `The site is hosted on secure infrastructure (Vercel) with mandatory HTTPS. We do not store passwords, payment details, or sensitive user information.`,
    },
    {
      title: 'Changes to This Policy',
      body: `We reserve the right to update this policy. Changes will be published on this page with the updated date.`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
      <header className="bg-[#131921] py-3 px-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#FF9900] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#131921]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">ReviewSnap</span>
          </Link>
        </div>
      </header>
      <div className="h-[3px] bg-[#FF9900]" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0f1111]">
            {it ? 'Informativa sulla Privacy' : 'Privacy Policy'}
          </h1>
          <p className="text-xs text-[#565959] mt-1">
            {it ? `Ultimo aggiornamento: ${UPDATED_IT}` : `Last updated: ${UPDATED}`} · {SITE}
          </p>
        </div>

        {sections.map(s => (
          <div key={s.title} className="card p-6 space-y-2">
            <h2 className="font-bold text-[#0f1111] text-sm">{s.title}</h2>
            {s.body.split('\n').map((line, i) => (
              <p key={i} className="text-sm text-[#333] leading-relaxed">{line}</p>
            ))}
          </div>
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}
