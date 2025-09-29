import React from 'react'
import { Link } from 'react-router-dom'

export default function Home({ t, lang }){
  return (
    <div className="bg-white">
      
      {/* Hero */}
      <section className="border-b bg-emerald-50/60">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-semibold mb-3">{t('welcome')}</h1>
          <p className="text-slate-700 mb-2">{t('welcomeSub')}</p>
        </div>
      </section>


      {/* Services overview */}
      <section>
        <div className="max-w-6xl mx-auto px-4 py-10 grid gap-6 md:grid-cols-3">
        {/* Vietnam Passport Service */}
        <div className="rounded-2xl border p-6 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">{t('vnPassport')}</h3>
          <p className="text-sm text-gray-600 mb-4">{t('vnPassportDesc')}</p>
          <a href="/vn-passport" className="px-4 py-2 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition">
            {t('startNow')}
          </a>
        </div>
        
          <div className="border rounded-2xl p-5">
            <h3 className="font-semibold text-lg mb-2">{t('sendMoney')}</h3>
            <p className="text-slate-600 mb-3">Request a transfer in minutes. Pay via Zelle and we’ll handle the rest.</p>
            <Link to="/send-money" className="text-emerald-700 font-medium">Start transfer →</Link>
          </div>
          <div className="border rounded-2xl p-5">
            <h3 className="font-semibold text-lg mb-2">Visa Exception (5 Years)</h3>
            <p className="text-slate-600 mb-3">For eligible applicants. {/** reusing text in detail page **/} Complete in 5–7 business days.</p>
            <Link to="/visa-services" className="text-emerald-700 font-medium">Apply now →</Link>
          </div>
          <div className="border rounded-2xl p-5">
            <h3 className="font-semibold text-lg mb-2">Help & Contact</h3>
            <p className="text-slate-600 mb-3">Questions about a transfer or document list? We’re here to help.</p>
            <Link to="/contact" className="text-emerald-700 font-medium">Contact us →</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-semibold mb-4">How it works</h2>
          <ol className="grid md:grid-cols-3 gap-4 list-decimal list-inside">
            <li className="border rounded-xl p-4">
              <div className="font-medium mb-1">Submit your request</div>
              <p className="text-slate-600">Use the Send Money or Visa form with accurate recipient details.</p>
            </li>
            <li className="border rounded-xl p-4">
              <div className="font-medium mb-1">Pay with Zelle</div>
              <p className="text-slate-600">Zelle to <b>Ngoc Anh Services</b> at <b>720-226-4972</b>.</p>
            </li>
            <li className="border rounded-xl p-4">
              <div className="font-medium mb-1">We process quickly</div>
              <p className="text-slate-600">Most transfers same/next day; Visa Exception typically 5–7 business days.</p>
            </li>
          </ol>
        </div>
      </section>
    </div>
  )
}
