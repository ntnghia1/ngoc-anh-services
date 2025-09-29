import React from 'react'

export default function Contact({ t, lang }){
  const [sending, setSending] = React.useState(false)
  const [notice, setNotice] = React.useState('')

  async function onSubmit(e){
    e.preventDefault()
    setNotice(''); setSending(true)
    const form = e.currentTarget
    const name = form.elements.namedItem('name')?.value?.trim() || ''
    const email = form.elements.namedItem('email')?.value?.trim() || ''
    const message = form.elements.namedItem('message')?.value?.trim() || ''

    try {
      const res = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toAdmin: true,
          toCustomer: false,
          customer: { name, email },
          txId: '',
          details: { topic: 'contact', message },
          zelle: { adminEmail: 'ntnghia00@yahoo.com', phone: '720-226-4972', name: 'Ngoc Anh Services' }
        })
      })
      const json = await res.json().catch(()=>({}))
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || 'Failed to send')
      }
      setNotice(t('thanks') || 'Thanks! We received your message. We’ll be in touch soon.')
      form.reset()
    } catch (err){
      setNotice((t('networkError') || 'Network error - please try again') + '')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-2">
      <h2 className="text-xl font-semibold">{t('contact')}</h2>
      <p className="text-slate-700">{t('contactBlurb')}</p>

      {notice && <div className="mt-2 rounded border px-3 py-2 text-sm">{notice}</div>}

      <form className="grid gap-3 mt-4" onSubmit={onSubmit}>
        <input name="name" placeholder={t('yourName') || 'Your name'} className="border rounded px-3 py-2" required />
        <input name="email" type="email" placeholder={t('email') || 'Email'} className="border rounded px-3 py-2" required />
        <textarea name="message" placeholder={t('message') || 'Message'} rows="5" className="border rounded px-3 py-2" required></textarea>
        <button type="submit" disabled={sending} className="w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition">
          {sending ? (t('sending') || 'Sending...') : (t('submit') || 'Send')}
        </button>
      </form>
    </div>
  )
}
