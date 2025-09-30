import Header from "./components/Header.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main className="min-h-[100dvh]">
        {/* your Routes / pages here */}
      </main>
    </>
  );
}

import React, { useState, lazy } from 'react'
import PrivacyModal from './components/PrivacyModal'
import { Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './Home.jsx'
import SendMoney from './SendMoney.jsx'
import VisaServices from './VisaServices.jsx'
import TrackFaqs from './TrackFaqs.jsx'
import Contact from './Contact.jsx'
import { makeT } from './translator'
const PrivacyPage = lazy(() => import('./Privacy.jsx'))
import logo from "./assets/logo.png";
import VNPassport from './VNPassport.jsx';

    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, []);
const [lang, setLang] = useState('en')
  const t = makeT(lang)

  return (
  <>
    <div className="min-h-screen flex flex-col">
{/* NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          <Link to="/"><img src={logo} alt="Ngọc Anh Services logo" className="h-16 md:h-20" /></Link>
          <div className="flex items-center gap-4">
            <NavLink to="/" className={({ isActive }) => `px-4 py-2 rounded-full transition ${isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-blue-100"}` }>{t('home')}</NavLink>
            <NavLink to="/send-money" className={({ isActive }) => `px-4 py-2 rounded-full transition ${isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-blue-100"}` }>{t('sendMoney')}</NavLink>
            <NavLink to="/visa-services" className={({ isActive }) => `px-4 py-2 rounded-full transition ${isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-blue-100"}` }>
              {lang==='vi' ? t('visaServicesVi') : t('visaServices')}
            </NavLink>
            <NavLink to="/vn-passport" className={({ isActive }) => `px-4 py-2 rounded-full transition ${isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-blue-100"}` }>
              VN Passport
            </NavLink>
            <NavLink to="/track-faqs" className={({ isActive }) => `px-4 py-2 rounded-full transition ${isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-blue-100"}` }>{t('trackFaqs')}</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `px-4 py-2 rounded-full transition ${isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-blue-100"}` }>{t('contact')}</NavLink>
        </div>
        </div>
      </nav>
      {/* LANGUAGE TOGGLE (under navbar) */}
      
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-end gap-2">
          <span className="text-sm text-slate-600">{t('language') || 'Language'}:</span>
          <button
            className={`px-3 py-1 rounded-full text-sm transition ${lang==="en" ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-blue-100"}`}
            onClick={()=>setLang('en')}
          >
            EN
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm transition ${lang==="vi" ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-blue-100"}`}
            onClick={()=>setLang('vi')}
          >
            VI
          </button>
        </div>
      </div>
{/* CONTENT */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home t={t} lang={lang} />} />
          <Route path="/send-money" element={<SendMoney t={t} lang={lang} />} />
          <Route path="/visa-services" element={<VisaServices t={t} lang={lang} />} />
          <Route path="/track-faqs" element={<TrackFaqs t={t} lang={lang} />} />
          <Route path="/contact" element={<Contact t={t} lang={lang} />} />
          <Route path="/privacy" element={<PrivacyPage t={t} lang={lang} />} />
          <Route path="/vn-passport" element={<VNPassport t={t} lang={lang} />} />
</Routes>
      </div>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-600">
          © {new Date().getFullYear()} Ngọc Anh Services
        </div>
      </footer>
    </div>
    <PrivacyModal open={showPrivacy} onClose={() => setShowPrivacy(false)} />
  </>
  )
}
