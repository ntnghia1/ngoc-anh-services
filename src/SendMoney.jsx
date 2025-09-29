import React, { useMemo, useState, useEffect } from "react"
import { saveSubmission } from './lib/saveSubmission'

async function fileToBase64(file){
  const buf = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i=0;i<bytes.length;i++){ binary += String.fromCharCode(bytes[i]); }
  return btoa(binary);
}


const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
]

const VIETNAM_PROVINCES = [
  "An Giang","Bà Rịa–Vũng Tàu","Bắc Giang","Bắc Kạn","Bạc Liêu","Bắc Ninh","Bến Tre","Bình Định","Bình Dương","Bình Phước","Bình Thuận","Cà Mau","Cần Thơ","Cao Bằng","Đà Nẵng","Đắk Lắk","Đắk Nông","Điện Biên","Đồng Nai","Đồng Tháp","Gia Lai","Hà Giang","Hà Nam","Hà Nội","Hà Tĩnh","Hải Dương","Hải Phòng","Hậu Giang","Hòa Bình","Hưng Yên","Khánh Hòa","Kiên Giang","Kon Tum","Lai Châu","Lâm Đồng","Lạng Sơn","Lào Cai","Long An","Nam Định","Nghệ An","Ninh Bình","Ninh Thuận","Phú Thọ","Phú Yên","Quảng Bình","Quảng Nam","Quảng Ngãi","Quảng Ninh","Quảng Trị","Sóc Trăng","Sơn La","Tây Ninh","Thái Bình","Thái Nguyên","Thanh Hóa","Thừa Thiên–Huế","Tiền Giang","TP Hồ Chí Minh","Trà Vinh","Tuyên Quang","Vĩnh Long","Vĩnh Phúc","Yên Bái"
]

// Simple i18n dictionary
const T = {
  en: {
    langName: "English",
    toggleLabel: "Language",
    sendMoney: "Send Money",
    success1: "Thanks! Your transfer request was submitted. We’ll review and email/text you next steps.",
    success2: "Please include Transaction ID {txId} in your Zelle memo.",
        transferDetails: "Transfer Details",
    senderInfo: "Sender Information",
    deliveryPayout: "Delivery / Payout",
    recipientInfo: "Recipient Information",
    notes: "Notes",
    summary: "Summary",
    zelleInstructions: "Zelle Instructions",
    sendCurrency: "Send Currency",
    receiveCurrency: "Receive Currency",
    sendAmountUSD: "Send Amount (USD)",
    receiveAmount: "Receive Amount ({cur})",
    rateFixed: "Exchange Rate (VND per 1 USD — fixed)",
    feeUSD: "Fee (USD)",
    fullName: "Full Name",
    phone: "Phone",
    email: "Email",
    address: "Address",
    city: "City",
    state: "State",
    payoutMethod: "Payout Method",
    deliverySpeed: "Delivery Speed",
    bankDeposit: "Bank Deposit",
    homeDelivery: "Home Delivery",
    standard: "Standard (1–2 days)",
    express: "Express (Same day)",
    recipAddress: "Recipient Address",
    deliveryAreaVN: "Delivery Area (Vietnam)",
    recipPhone: "Recipient Phone",
    acctHolder: "Account Holder",
    bankName: "Bank Name",
    acctNumber: "Account Number",
    notesPh: "Special instructions…",
    summarySend: "Send",
    summaryReceive: "Receive",
    summaryRate: "Rate",
    summaryFee: "Fee",
    totalToZelle: "Total to Zelle",
    sendViaZelleTo: "Send via Zelle to",
    memoTxId: "Memo / Transaction ID:",
    memoNote: "Include this Transaction ID in your Zelle memo so we can match your payment.",
    ackZelle: "I will Zelle the total amount to",
    ackZelle2: "at",
    ackAccuracy: "All recipient details are correct. I understand incorrect info can delay delivery.",
    submit: "Submit Request",
    sending: "Sending…",
    feeNote: "$2 per $100 sent (2%).",
    // validation
    v_amount: "Enter a positive USD amount",
    v_required: "Required",
    v_phone: "Enter a valid phone",
    v_email: "Invalid email",
    v_acct: "Enter a valid account number (6+ digits)",
  },
  vi: {
    langName: "Tiếng Việt",
    toggleLabel: "Ngôn ngữ",
    sendMoney: "Gửi tiền",
    success1: "Cảm ơn! Yêu cầu chuyển tiền của bạn đã được gửi. Chúng tôi sẽ kiểm tra và liên hệ qua email/tin nhắn.",
    success2: "Please include Transaction ID {txId} in your Zelle memo.",
        transferDetails: "Chi tiết giao dịch",
    senderInfo: "Thông tin người gửi",
    deliveryPayout: "Hình thức giao/nhận tiền",
    recipientInfo: "Thông tin người nhận",
    notes: "Ghi chú",
    summary: "Tóm tắt",
    zelleInstructions: "Hướng dẫn Zelle",
    sendCurrency: "Tiền gửi",
    receiveCurrency: "Tiền nhận",
    sendAmountUSD: "Số tiền gửi (USD)",
    receiveAmount: "Số tiền nhận ({cur})",
    rateFixed: "Tỷ giá (VND cho 1 USD — cố định)",
    feeUSD: "Phí (USD)",
    fullName: "Họ và tên",
    phone: "Số điện thoại",
    email: "Email",
    address: "Địa chỉ",
    city: "Thành phố",
    state: "Tiểu bang",
    payoutMethod: "Hình thức nhận tiền",
    deliverySpeed: "Tốc độ giao dịch",
    bankDeposit: "Chuyển khoản ngân hàng",
    homeDelivery: "Giao tận nhà",
    standard: "Tiêu chuẩn (1–2 ngày)",
    express: "Nhanh (Trong ngày)",
    recipAddress: "Địa chỉ người nhận",
    deliveryAreaVN: "Khu vực giao (Việt Nam)",
    recipPhone: "Số điện thoại người nhận",
    acctHolder: "Chủ tài khoản",
    bankName: "Ngân hàng",
    acctNumber: "Số tài khoản",
    notesPh: "Hướng dẫn thêm…",
    summarySend: "Gửi",
    summaryReceive: "Nhận",
    summaryRate: "Tỷ giá",
    summaryFee: "Phí",
    totalToZelle: "Tổng gửi qua Zelle",
    sendViaZelleTo: "Gửi qua Zelle đến",
    memoTxId: "Ghi chú / Mã giao dịch:",
    memoNote: "Vui lòng ghi Mã giao dịch này trong ghi chú Zelle để chúng tôi đối chiếu.",
    ackZelle: "Tôi sẽ chuyển toàn bộ số tiền qua Zelle đến",
    ackZelle2: "tại",
    ackAccuracy: "Tôi xác nhận thông tin người nhận là chính xác. Thông tin sai có thể làm chậm việc giao tiền.",
    submit: "Gửi yêu cầu",
    sending: "Đang gửi…",
    feeNote: "$2 trên mỗi $100 gửi (2%).",
    // validation
    v_amount: "Nhập số tiền USD hợp lệ (> 0)",
    v_required: "Bắt buộc",
    v_phone: "Nhập số điện thoại hợp lệ",
    v_email: "Email không hợp lệ",
    v_acct: "Nhập số tài khoản hợp lệ (tối thiểu 6 chữ số)",
  }
}

// NA-xxx-xxx (digits only)
const genId = () => {
  const part = () => String(Math.floor(Math.random() * 1000)).padStart(3, "0")
  return `NA-${part()}-${part()}`
}

export default function SendMoney({ t: tFn, lang }) {// Toggle: "en" | "vi"
  const t = T[lang || "en"]

  const [amountUSD, setAmountUSD] = useState(100)
  const [rate] = useState(26100) // fixed, readOnly
  const [receiveCurrency, setReceiveCurrency] = useState("USD")
  
  // added by fix: payout method + delivery speed + misc states
  const [payoutMethod, setPayoutMethod] = useState("home_delivery")
  const [deliverySpeed, setDeliverySpeed] = useState("24h")
  const [notes, setNotes] = useState("")
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [txId, setTxId] = useState(genId())
/* enforce VND for bank_deposit */
  useEffect(() => {
    try {
      if (payoutMethod === "bank_deposit" && receiveCurrency !== "VND") {
        setReceiveCurrency("VND");
      }
    } catch {}
  }, [payoutMethod]);  


  const feeUSD = useMemo(() => {
    const v = (Number(amountUSD) || 0) * 0.02
    return Math.round(v * 100) / 100
  }, [amountUSD])

  const receiveAmount = useMemo(() => {
    const amt = Number(amountUSD) || 0
    if (receiveCurrency === "VND") return Math.round(amt * (Number(rate) || 0))
    return Math.round(amt * 100) / 100
  }, [amountUSD, rate, receiveCurrency])

  const totalDueUSD = useMemo(() => {
    const amt = Number(amountUSD) || 0
    return Math.round((amt + feeUSD) * 100) / 100
  }, [amountUSD, feeUSD])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Language toggle */}
      <div className="flex justify-end mb-2 gap-2 items-center">
        <h1 className="text-2xl font-semibold mb-2">{t.sendMoney}</h1>
</div>

      {submitted && (
        <div className="mb-6 rounded border border-emerald-300 bg-emerald-50 p-4 text-blue-700">
          {t.success1}
          <div className="mt-1 text-sm">{t.success2.replace("{txId}", txId)}</div>
        </div>
      )}

      <form
        name="send-money"
        method="POST"
        onSubmit={async (e) => {
          e.preventDefault()
          if (sending) return
          const fd = new FormData(e.currentTarget)
          const obj = Object.fromEntries(fd.entries())
          let idUrl = '';
          const idFile = fd.get('idFile');
          if (idFile && idFile.size > 0) {
            try {
              const dataBase64 = await fileToBase64(idFile);
              const up = await fetch('/.netlify/functions/upload-id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ txId, name: idFile.name, contentType: idFile.type || 'application/octet-stream', dataBase64 })
              });
              const uj = await up.json();
              if (up.ok && uj.ok) idUrl = uj.url;
            } catch (e) { console.error('ID upload failed', e); }
          }
          const errs = {}

          // Validation helpers
          const digitCount = (v) => (String(v||"").replace(/\D/g, "").length)
          const isPhoneish = (v) => digitCount(v) >= 9
          const isEmail = (v) => /^\S+@\S+\.\S+$/.test(String(v||"").trim())

          // Validation
          if (!obj.amountUSD || Number(obj.amountUSD) <= 0) errs.amountUSD = t.v_amount
          if (!obj.senderName) errs.senderName = t.v_required
          if (!obj.senderPhone || !isPhoneish(obj.senderPhone)) errs.senderPhone = t.v_phone
          if (obj.senderEmail && !isEmail(obj.senderEmail)) errs.senderEmail = t.v_email

          if (obj.payoutMethod === "bank_deposit") {
            if (!obj.recipientAccountHolder) errs.recipientAccountHolder = t.v_required
            if (!obj.recipientBankName) errs.recipientBankName = t.v_required
            if (!obj.recipientAccountNumber || digitCount(obj.recipientAccountNumber) < 6) errs.recipientAccountNumber = t.v_acct
            if (!obj.recipientPhone || !isPhoneish(obj.recipientPhone)) errs.recipientPhone = t.v_phone
          } else {
            if (!obj.recipientAddress) errs.recipientAddress = t.v_required
            if (!obj.deliveryArea) errs.deliveryArea = t.v_required
            if (!obj.recipientPhone || !isPhoneish(obj.recipientPhone)) errs.recipientPhone = t.v_phone
          }

          if (Object.keys(errs).length) { setErrors(errs); return }
          setErrors({})
          setSending(true)

          try {
            const resp = await fetch("/.netlify/functions/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(obj)
            })
            if (!resp.ok) {
              const txt = await resp.text()
              alert(`Submit failed (${resp.status}). ${txt}`)
              setSending(false)
              return
            }
            setSubmitted(true)

            try {
              const rec = {
                tx_id: txId,
                sender_name: (obj.senderName || obj.fullName || obj.name || ''),
                sender_email: (obj.email || obj.senderEmail || ''),
                sender_phone: (obj.phone || obj.senderPhone || ''),
                amount_usd: Number(obj.amountUSD || obj.amount || 0),
                payout_method: (obj.payoutMethod || obj.delivery || ''),
                receive_country: (obj.country || obj.receiveCountry || ''),
                recipient_name: (obj.recipientName || ''),
                recipient_phone: (obj.recipientPhone || ''),
                id_url: (idUrl || ''),
                notes: (obj.notes || ''),
                raw: obj
              };
              await saveSubmission('send_money', rec);
            } catch (_) {}
                    setSending(false)
            e.currentTarget.reset()
            setTxId(genId())
          } catch (err) {
            console.warn("Submit network error — proceeding with soft success", err)
            setSubmitted(true)
            setSending(false)
          }
        }}
        className="grid gap-6 md:grid-cols-3"
      >
        <input type="hidden" name="form-name" value="send-money" />
        <input type="hidden" name="transactionId" value={txId} />
        <input type="hidden" name="totalDueUSD" value={totalDueUSD} />
        <input type="hidden" name="lang" value={lang} />

        {/* LEFT: Transfer + Sender + Delivery */}
        <section className="md:col-span-2 space-y-6">
          {/* Transfer Details */}
          <div className="rounded-xl border p-4">
            <h2 className="font-medium mb-4">{t.transferDetails}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">{t.sendCurrency}</label>
                <select className="w-full border rounded px-3 py-2 bg-slate-50 cursor-not-allowed" value="USD" disabled>
                  <option value="USD">USD (fixed)</option>
                </select>
                <input type="hidden" name="sendCurrency" value="USD" />
              </div>
              <div>
                <label className="block text-sm mb-1">{t.receiveCurrency}</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  name="receiveCurrency" disabled={payoutMethod==="bank_deposit"}
                  value={receiveCurrency}
                  onChange={(e) => setReceiveCurrency(e.target.value)}
                >
                  <option value="USD" disabled={payoutMethod==="bank_deposit"}>USD</option>
                  <option value="VND">VND</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">{t.sendAmountUSD}</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  name="amountUSD"
                  type="number"
                  min="0"
                  step="1"
                  value={amountUSD}
                  onChange={(e) => setAmountUSD(parseFloat(e.target.value || 0))}
                  required
                />
                {errors.amountUSD && <p className="text-xs text-red-600 mt-1">{errors.amountUSD}</p>}
              </div>
              <div>
                <label className="block text-sm mb-1">{t.receiveAmount.replace("{cur}", receiveCurrency)}</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-slate-50"
                  type="text"
                  name="receiveAmount"
                  value={receiveAmount.toLocaleString()}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm mb-1">{t.rateFixed}</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="number"
                  name="rate"
                  value={rate}
                  readOnly
                />
                {errors.rate && <p className="text-xs text-red-600 mt-1">{errors.rate}</p>}
              </div>
              <div>
                <label className="block text-sm mb-1">{t.feeUSD}</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-slate-50"
                  type="text"
                  name="feeUSD"
                  value={feeUSD.toFixed(2)}
                  readOnly
                />
                <p className="text-xs text-slate-500 mt-1">{t.feeNote}</p>
              </div>
            </div>
          </div>

          {/* Sender Information */}
          <div className="rounded-xl border p-4">
            <h2 className="font-medium mb-4">{t.senderInfo}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">{t.fullName}</label>
                <input className="w-full border rounded px-3 py-2" name="senderName" required />
                {errors.senderName && <p className="text-xs text-red-600 mt-1">{errors.senderName}</p>}
              </div>
              <div>
                <label className="block text-sm mb-1">{t.phone}</label>
                <input className="w-full border rounded px-3 py-2" name="senderPhone" required />
                {errors.senderPhone && <p className="text-xs text-red-600 mt-1">{errors.senderPhone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm mb-1">{t.email}</label>
                <input className="w-full border rounded px-3 py-2" type="email" name="senderEmail" />
                {errors.senderEmail && <p className="text-xs text-red-600 mt-1">{errors.senderEmail}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm mb-1">{t.address}</label>
                <input className="w-full border rounded px-3 py-2" name="senderAddress" placeholder="Street address" />
              </div>
              <div>
                <label className="block text-sm mb-1">{t.city}</label>
                <input className="w-full border rounded px-3 py-2" name="senderCity" />
              </div>
              <div>
                <label className="block text-sm mb-1">{t.state}</label>
                <select className="w-full border rounded px-3 py-2" name="senderState" defaultValue="CO">
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Delivery / Payout BEFORE Recipient */}
          <div className="rounded-xl border p-4">
            <h2 className="font-medium mb-4">{t.deliveryPayout}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">{t.payoutMethod}</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  name="payoutMethod"
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                >
                  <option value="home_delivery">{t.homeDelivery}</option>
                  <option value="bank_deposit">{t.bankDeposit}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">{t.deliverySpeed}</label>
                <select className="w-full border rounded px-3 py-2" name="deliverySpeed" value={deliverySpeed} onChange={(e)=>setDeliverySpeed(e.target.value)} value={deliverySpeed} onChange={(e)=>setDeliverySpeed(e.target.value)}>
  <option value="24h">24 hours</option>
</select>
              </div>
            </div>
          </div>

          {/* Recipient — conditional */}
          <div className="rounded-xl border p-4">
            <h2 className="font-medium mb-4">{t.recipientInfo}</h2>

            {payoutMethod === "bank_deposit" ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm mb-1">{t.acctHolder}</label>
                  <input className="w-full border rounded px-3 py-2" name="recipientAccountHolder" required />
                  {errors.recipientAccountHolder && <p className="text-xs text-red-600 mt-1">{errors.recipientAccountHolder}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">{t.bankName}</label>
                  <input className="w-full border rounded px-3 py-2" name="recipientBankName" required />
                  {errors.recipientBankName && <p className="text-xs text-red-600 mt-1">{errors.recipientBankName}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">{t.acctNumber}</label>
                  <input className="w-full border rounded px-3 py-2" name="recipientAccountNumber" required />
                  {errors.recipientAccountNumber && <p className="text-xs text-red-600 mt-1">{errors.recipientAccountNumber}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm mb-1">{t.recipPhone}</label>
                  <input className="w-full border rounded px-3 py-2" name="recipientPhone" required />
                  {errors.recipientPhone && <p className="text-xs text-red-600 mt-1">{errors.recipientPhone}</p>}
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm mb-1">{t.recipAddress}</label>
                  <input className="w-full border rounded px-3 py-2" name="recipientAddress" placeholder="Street, Ward, District, City/Province" required />
                  {errors.recipientAddress && <p className="text-xs text-red-600 mt-1">{errors.recipientAddress}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">{t.deliveryAreaVN}</label>
                  <select className="w-full border rounded px-3 py-2" name="deliveryArea" required defaultValue="TP Hồ Chí Minh">
                    {VIETNAM_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.deliveryArea && <p className="text-xs text-red-600 mt-1">{errors.deliveryArea}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">{t.recipPhone}</label>
                  <input className="w-full border rounded px-3 py-2" name="recipientPhone" required />
                  {errors.recipientPhone && <p className="text-xs text-red-600 mt-1">{errors.recipientPhone}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border p-4">
            <h2 className="font-medium mb-2">{t.notes}</h2>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={3}
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPh}
            />
          </div>
        </section>

        {/* RIGHT: Summary */}
        <aside className="md:col-span-1 space-y-4">
          <div className="rounded-xl border p-4">
            <h3 className="font-medium mb-2">{t.summary}</h3>
            <ul className="text-sm space-y-1">
              <li>{t.summarySend}: <b>{Number(amountUSD || 0).toLocaleString()}</b> USD</li>
              <li>{t.summaryReceive}: <b>{receiveAmount.toLocaleString()}</b> {receiveCurrency}</li>
              {receiveCurrency === "VND" && (
                <li>{t.summaryRate}: <b>{Number(rate || 0).toLocaleString()}</b> VND / USD</li>
              )}
              <li>{t.summaryFee}: <b>{feeUSD.toFixed(2)}</b> USD</li>
            </ul>
            <div className="mt-3 border-t pt-3 font-semibold">
              {t.totalToZelle}: {totalDueUSD.toLocaleString()} USD
            </div>
          </div>

          <div className="rounded-xl border p-4 text-sm">
            <h4 className="font-medium mb-2">{t.zelleInstructions}</h4>
            <p><b>{t.totalToZelle}:</b> {totalDueUSD.toLocaleString()} USD</p>
            <p className="mt-1"><b>{t.sendViaZelleTo}</b></p>
            <p>Ngoc Anh Services — {t.phone}: <b>720-226-4972</b></p>
            <p className="mt-2"><b>{t.memoTxId}</b> <code>{txId}</code></p>
            <p className="text-xs text-slate-600 mt-1">{t.memoNote}</p>
          </div>


          {/* Customer ID upload (optional) */}
          <div className="rounded-xl border p-4 bg-gray-50">
            <label className="block text-sm mb-1">Government ID (optional)</label>
            <input
              name="idFile"
              type="file"
              accept="image/*,application/pdf"
              className="w-full border p-2 rounded bg-white"
            />
            <p className="text-xs text-slate-500 mt-1">You can upload a clear photo or PDF of your ID to help us verify the transfer.</p>
          </div>

          <div className="rounded-xl border p-4 text-sm space-y-2">
            <label className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1" name="ackZelle" />
              <span>{t.ackZelle} <b>Ngoc Anh Services</b> {t.ackZelle2} <b>720-226-4972</b>.</span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1" name="ackAccuracy" />
              <span>{t.ackAccuracy}</span>
            </label>
          </div>

          <button disabled={sending} className={`w-full px-4 py-2 rounded text-white ${sending ? "bg-emerald-300 cursor-not-allowed" : "bg-blue-600"}`}>{sending ? t.sending : t.submit}</button>
        </aside>
      </form>
    </div>
  )
}
