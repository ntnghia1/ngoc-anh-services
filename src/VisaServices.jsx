import PrivacyModal from './components/PrivacyModal'
import React, { useState } from "react"
import { saveSubmission } from './lib/saveSubmission'

function makeVisaTx(){
  const a = Math.floor(100 + Math.random()*900);
  const b = Math.floor(100 + Math.random()*900);
  return `VISA-${a}-${b}`;
}

export default function VisaServices({ t }){
  const [submitted, setSubmitted] = useState(false)
  const [emailSendStatus, setEmailSendStatus] = useState(null)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [txId, setTxId] = useState(() => makeVisaTx())
  const VISA_FEE = 120
  const [modalImg, setModalImg] = useState(null)
  const onSubmit = async (e) => { e.preventDefault(); setSubmitted(true); 


try {
  const formEl = e.currentTarget;
  const fd = new FormData(formEl);
  const obj = Object.fromEntries(fd.entries());
  const res = await fetch('/.netlify/functions/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      toCustomer: true,
      toAdmin: true,
      customer: {
        email: obj.email || '',
        phone: obj.phone || '',
        name: obj.name || obj.fullName || ''
      },
      txId,
      details: {
        visaType: obj.visaType || obj.visa || '',
        name: obj.name || obj.fullName || '',
        fullName: obj.fullName || obj.name || '',
        dateOfBirth: obj.dob || obj.dateOfBirth || '',
        nationality: obj.nationality || '',
        issuingCountry: obj.issuingCountry || obj.issuing_country || '',
        passportNumber: obj.passportNumber || obj.passport || '',
        email: obj.email || '',
        phone: obj.phone || '',
        address1: obj.address1 || obj.address || '',
        address2: obj.address2 || '',
        city: obj.city || '',
        state: obj.state || '',
        zip: obj.zip || '',
        notes: obj.notes || ''
      },
      zelle: { adminEmail: 'ntnghia00@yahoo.com' }
    })
  });
  const j = await res.json();
  setEmailSendStatus(j);
  if (!res.ok || !j.ok) {
    console.error('[Email] failed', j);
    if (typeof setDbStatus === 'function') setDbStatus('Saved to Supabase ✅ Email failed.');
  } else {
    if (typeof setDbStatus === 'function') setDbStatus('Saved to Supabase ✅ Email sent ✅');
  }
} catch (err) {
  console.error('[Email] network error', err);
  if (typeof setDbStatus === 'function') setDbStatus('Saved to Supabase ✅ Email failed (network).');


  // Also try to persist to Supabase (non-blocking)
  try {
    const rec = {
      tx_id: txId,
      email: obj.email || '',
      phone: obj.phone || '',
      full_name: obj.fullName || obj.name || '',
      date_of_birth: obj.dob || obj.dateOfBirth || null,
      nationality: obj.nationality || '',
      issuing_country: obj.issuingCountry || '',
      passport_number: obj.passportNumber || '',
      visa_type: obj.visaType || obj.visa || '',
      id_url: null,
      raw: obj
    }
    await saveSubmission('visa', rec)
  } catch (_) {}

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="border rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-2">{t('visaIntroTitle')}</h2>
        <p className="text-slate-700 leading-relaxed">{t('visaIntro')}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 border rounded-xl p-4">

{/* Contact info */}
        <h3 className="text-base font-semibold">{t('visaFormTitle')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block capitalize font-semibold mb-1 text-sm">{t('visaType')}</label>
            <select className="w-full border rounded px-3 py-2" defaultValue="Visa Exception, 5 Years">
              <option value="Visa Exception, 5 Years">{t('visaTypeDefault')}</option>
            </select>
          </div>

          <div>
            <label className="block capitalize font-semibold mb-1 text-sm">{t('fullName')}</label>
            <input className="w-full border rounded px-3 py-2" required />
          </div>

          <div>
            <label className="block capitalize font-semibold mb-1 text-sm">{t('dob')}</label>
            <input type="date" className="w-full border rounded px-3 py-2" required />
          </div>

          <div>
            <label className="block capitalize font-semibold mb-1 text-sm">{t('nationality')}</label>
            <input className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block capitalize font-semibold mb-1 text-sm">{t('issuingCountry')}</label>
            <input className="w-full border rounded px-3 py-2" defaultValue={t('defaultIssuingCountry')} />
          </div>

          <div>
            <label className="block capitalize font-semibold mb-1 text-sm">{t('passportNumber')}</label>
            <input className="w-full border rounded px-3 py-2" required />
          </div>

        {/* Contact info */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <label className="block capitalize font-semibold mb-1 text-sm">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full border rounded px-3 py-2"
              required
            className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block capitalize font-semibold mb-1 text-sm">Phone Number</label>
            <input
              name="phone"
              type="tel"
              placeholder="Phone number"
              className="w-full border rounded px-3 py-2"
              required
            className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        </div>
{/* Address */}
<div>
  <label className="block capitalize font-semibold mb-1 text-sm">{t("address") || "Address"}</label>
  <input
    name="address"
    type="text"
    className="w-full border p-2 rounded"
    autoComplete="address-line1"
    required
  />
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block capitalize font-semibold mb-1 text-sm">{t("city") || "City"}</label>
    <input
      name="city"
      type="text"
      className="w-full border p-2 rounded"
      autoComplete="address-level2"
      required
    />
  </div>
  <div>
    <label className="block capitalize font-semibold mb-1 text-sm">{t("state") || "State"}</label>
    <select name="state" className="w-full border p-2 rounded" autoComplete="address-level1" required>
      <option value="AL">AL</option>
      <option value="AK">AK</option>
      <option value="AZ">AZ</option>
      <option value="AR">AR</option>
      <option value="CA">CA</option>
      <option value="CO">CO</option>
      <option value="CT">CT</option>
      <option value="DC">DC</option>
      <option value="DE">DE</option>
      <option value="FL">FL</option>
      <option value="GA">GA</option>
      <option value="HI">HI</option>
      <option value="IA">IA</option>
      <option value="ID">ID</option>
      <option value="IL">IL</option>
      <option value="IN">IN</option>
      <option value="KS">KS</option>
      <option value="KY">KY</option>
      <option value="LA">LA</option>
      <option value="MA">MA</option>
      <option value="MD">MD</option>
      <option value="ME">ME</option>
      <option value="MI">MI</option>
      <option value="MN">MN</option>
      <option value="MO">MO</option>
      <option value="MS">MS</option>
      <option value="MT">MT</option>
      <option value="NC">NC</option>
      <option value="ND">ND</option>
      <option value="NE">NE</option>
      <option value="NH">NH</option>
      <option value="NJ">NJ</option>
      <option value="NM">NM</option>
      <option value="NV">NV</option>
      <option value="NY">NY</option>
      <option value="OH">OH</option>
      <option value="OK">OK</option>
      <option value="OR">OR</option>
      <option value="PA">PA</option>
      <option value="RI">RI</option>
      <option value="SC">SC</option>
      <option value="SD">SD</option>
      <option value="TN">TN</option>
      <option value="TX">TX</option>
      <option value="UT">UT</option>
      <option value="VA">VA</option>
      <option value="VT">VT</option>
      <option value="WA">WA</option>
      <option value="WI">WI</option>
      <option value="WV">WV</option>
      <option value="WY">WY</option>
    </select>
  </div>
</div>

<div>
  <label className="block capitalize font-semibold mb-1 text-sm">{t("zip") || "Zip"}</label>
  <input
    name="zip"
    type="text"
    className="w-full border p-2 rounded"
    autoComplete="postal-code"
    required
  />
</div>


{/* Documents */}
<div className="rounded-xl border p-4 bg-gray-50">
  <h3 className="mb-2">{t('documents') || 'Documents'}</h3>

  <div className="grid gap-4">
    <div>
      <label className="block capitalize font-semibold mb-1 text-sm">{t('passportScan') || 'Passport scan'}</label>
      <input
        name="passportFile"
        type="file"
        accept="image/*,application/pdf"
        className="w-full border p-2 rounded bg-white"
      />
              <div className="inline-block mt-2">
                <input type="hidden" name="transactionId" value={txId || ""} />
        <button type="button" onClick={()=>setModalImg('/examples/passport-scan-example.png')}>
                  <img src="/examples/passport-scan-example.png" alt="Example" className="h-24 w-auto rounded border" />
                </button>
              </div>
    </div>

    <div>
      <label className="block capitalize font-semibold mb-1 text-sm">{t('passportPhoto') || 'Passport-style photo'}</label>
      <input
        name="photoFile"
        type="file"
        accept="image/*"
        className="w-full border p-2 rounded bg-white"
      />
              <div className="inline-block mt-2">
                <button type="button" onClick={()=>setModalImg('/examples/passport-photo-example.png')}>
                  <img src="/examples/passport-photo-example.png" alt="Example" className="h-24 w-auto rounded border" />
                </button>
              </div>
    </div>
  </div>
</div>
        {/* Consent to upload & storage */}
        <div className="mt-4">
          <label className="capitalize flex font-semibold items-start space-x-2">
            <input type="checkbox" name="consent" required className="mt-1 w-4 h-4" />
            <div className="text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: t('consentText') }} />
          </label>
        </div>
    
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition">{t('submit')}</button>
        {emailSendStatus != null && (
          <div className={`mt-2 text-sm ${emailSendStatus.ok ? "text-emerald-700" : "text-red-600"}`}>
            {emailSendStatus.ok ? "Email sent" : "Email failed"}
          </div>
        )}
        <p className="text-emerald-700 font-medium">{t('completeTime')}</p>
      
          <div className="mt-3 p-3 rounded bg-emerald-50 border border-emerald-200">
            <div className="font-medium">Visa fee: $120</div>
            <div className="text-sm text-slate-600 mt-1">
              Please send the visa fee via <strong>Zelle</strong> to <strong>Ngoc Anh Services</strong> at <strong>720-226-4972</strong>.
              Include your transaction ID in the memo so we can match your payment.
            </div>
            {txId && (
              <div className="mt-2 text-sm">
                <div>Transaction ID: <strong>{txId}</strong></div>
                <button type="button" onClick={() => navigator.clipboard && navigator.clipboard.writeText(txId)} className="mt-1 text-xs underline">
                  Copy ID
                </button>
                <button type="button" onClick={() => navigator.clipboard && navigator.clipboard.writeText(`Visa fee for application ${txId}`)} className="ml-3 mt-1 text-xs underline">
                  Copy Zelle memo
                </button>
              </div>
            )}
          </div>
        </form>
        <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} t={t} />

      
      {submitted && (
        <>
          <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm">
            {t('submittedNotice') || 'Your application was submitted successfully.'}
          </div>
          <div className="p-3 rounded bg-emerald-50 border border-emerald-200">{t('thanks')}</div>
        </>
      )}
{modalImg && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setModalImg(null)}>
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={modalImg} alt="Example" className="w-full h-auto rounded shadow-lg" />
            <p className="text-xs text-white/90 mt-2 text-center">
              {modalImg === "/examples/passport-scan-example.png" ? t("examplePassportScan") : t("examplePassportPhoto")}
            </p>
            <button type="button" className="w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition" onClick={() => setModalImg(null)}>Close</button>
          </div>
        </div>
      )}

    </div>
  )
}
}
