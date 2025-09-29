import React, { useState } from 'react'

function QA({ q, a }){
  const [open, setOpen] = useState(false)
  return (
    <div className="border rounded-xl">
      <button
        type="button"
        onClick={()=>setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 text-left"
      >
        <span className="font-medium">{q}</span>
        <span className="text-slate-500">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-4 pb-4 text-slate-700">{a}</div>}
    </div>
  )
}

export default function TrackFaqs({ t, lang }){
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h2 className="text-xl font-semibold">Tracking request received</h2>
        <p className="text-slate-700">We’ll email or text you with the latest status shortly.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <section className="grid gap-6 md:grid-cols-2">
        {/* Tracking form */}
        <form
          name="track-form"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          className="space-y-4 border rounded-2xl p-5"
          onSubmit={(e)=>{ e.preventDefault(); setSubmitted(true) }}
        >
          <input type="hidden" name="form-name" value="track-form" />
          <p className="hidden">
            <label>Don’t fill this out: <input name="bot-field" onChange={()=>{}} /></label>
          </p>

          <h2 className="text-lg font-semibold">Track a transfer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Tracking ID (if provided)</label>
              <input className="w-full border rounded px-3 py-2" name="trackingId" />
            </div>
            <div>
              <label className="block text-sm mb-1">Phone (sender)</label>
              <input className="w-full border rounded px-3 py-2" name="senderPhone" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Last Name (sender)</label>
              <input className="w-full border rounded px-3 py-2" name="senderLastName" required />
            </div>
          </div>

          <button className="px-5 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">Check Status</button>
          <p className="text-xs text-slate-500">Tip: You can also reply to the confirmation email/SMS you received.</p>
        </form>

        {/* Quick help */}
        <div className="border rounded-2xl p-5">
          <h2 className="text-lg font-semibold mb-3">Need help fast?</h2>
          <ul className="space-y-2 text-slate-700">
            <li>Call / Zelle: <b>720-226-4972</b></li>
            <li>Email: <b>ntnghia00@yahoo.com</b></li>
            <li>Hours: 9:00–18:00 (Mon–Sat)</li>
          </ul>
        </div>
      </section>

      {/* FAQs */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="grid gap-3">
          <QA q="How long does a money transfer take?" a="Most transfers are delivered same day or next business day, depending on payout method and verification." />
          <QA q="What information do I need for the recipient?" a="Recipient full name, phone, city/country, and bank or cash-pickup details. For bank deposit, provide bank name and account number." />
          <QA q="What is the exchange rate and fee?" a="You’ll see an editable exchange rate and fee on the Send Money form before you submit. Total due is shown clearly." />
          <QA q="How do I pay?" a="Pay via Zelle to Ngoc Anh Services at 720-226-4972. Include your name in the memo to match your request." />
          <QA q="Visa Exception processing time?" a="Typically 5–7 business days after all required documents are received." />
        </div>
      </section>
    </div>
  )
}
