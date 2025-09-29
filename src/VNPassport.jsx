
import React, { useState } from 'react';

export default function VNPassport({ t, lang }) {
  const [form, setForm] = useState({
    fullName: "", dob: "", sex: "", pob: "", phone: "",
    addressUS: "", addressVN: "", occupation: "", workInfo: "",
    fatherName: "", fatherDob: "", motherName: "", motherDob: "",
    spouseName: "", spouseDob: "", departDate: "", airport: "",
    usIdFile: null, oldVnPassFile: null, photoFile: null,
    email: "", 
  });
  const [submitting, setSubmitting] = useState(false);
  const [txId] = useState(() => "VN-PASS-" + Math.random().toString(36).slice(2,8).toUpperCase());

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm((s) => ({ ...s, [name]: files[0] }));
    else setForm((s) => ({ ...s, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([k,v]) => payload.append(k, v));
      payload.append("formName", "VN Passport Renewal");
      payload.append("txId", txId);
      payload.append("fee", "$230");

      let res;
      try {
        res = await fetch("/.netlify/functions/sendEmail", {
          method: "POST",
          body: payload,
        });
      } catch(err) {
        res = null;
      }

      if (!res || !res.ok) {
        const subject = encodeURIComponent(`VN Passport Renewal - ${txId}`);
        const body = encodeURIComponent(
`Request Type: VN Passport Renewal
Transaction ID: ${txId}
Fee: $230

Applicant:
- {t('fullName')}: ${form.fullName}
- {t('dob')}: ${form.dob}
- {t('sex')}: ${form.sex}
- {t('pob')}: ${form.pob}
- {t('phone')}: ${form.phone}
- {t('addressUS')}: ${form.addressUS}
- {t('addressVN')}: ${form.addressVN}
- {t('occupation')}: ${form.occupation}
- Work Name & Address: ${form.workInfo}
- Father: ${form.fatherName} (DOB: ${form.fatherDob})
- Mother: ${form.motherName} (DOB: ${form.motherDob})
- Spouse: ${form.spouseName} (DOB: ${form.spouseDob})
- {t('departDate')}: ${form.departDate}
- {t('airport')}: ${form.airport}

Customer Email: ${form.email}
`
        );
        window.location.href = `mailto:ntnghia00@yahoo.com?subject=${subject}&body=${body}`;
      } else {
        alert("Thanks! Your VN Passport Renewal request was submitted. We'll email/text you next steps.");
      }
    } catch(err) {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container mx-auto p-4 md:p-6">
      <div className="mb-4 p-3 rounded-xl bg-blue-50 border">
        <p className="font-medium">Please use this Transaction ID as your Zelle memo:</p>
        <div className="flex items-center gap-2 mt-2">
          <code className="px-3 py-1 rounded-lg bg-white border">{txId}</code>
          <button type="button" className="px-3 py-1 rounded-lg border" onClick={() => navigator.clipboard.writeText(txId)}>Copy</button>
        </div>
        <p className="mt-2">Passport Renewal Fee: <span className="font-semibold">$230</span></p>
      </div>

                  {/* Add title above form */}
<h2 className="text-2xl font-bold mb-4 text-center">
  {lang === "vi" ? "Đơn Cấp Hộ Chiếu Việt Nam" : "VN Passport Form"}
</h2>

<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="fullName" className="mb-1 text-sm font-medium">{t('fullName')}</label>
          <input id="fullName" name="fullName" className="border rounded-xl p-3" onChange={onChange} required />
        </div>
        <div className="flex flex-col">
          <label htmlFor="dob" className="mb-1 text-sm font-medium">{t('dob')}</label>
          <input id="dob" name="dob" type="date" className="border rounded-xl p-3" onChange={onChange} required />
        </div>

        <div className="flex flex-col">
          <label htmlFor="sex" className="mb-1 text-sm font-medium">{t('sex')}</label>
          <select id="sex" name="sex" className="border rounded-xl p-3" onChange={onChange} required>
            <option value="">{t('selectSex')}</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="pob" className="mb-1 text-sm font-medium">{t('pob')}</label>
          <input id="pob" name="pob" className="border rounded-xl p-3" onChange={onChange} required />
        </div>

        <div className="flex flex-col">
          <label htmlFor="phone" className="mb-1 text-sm font-medium">{t('phone')}</label>
          <input id="phone" name="phone" className="border rounded-xl p-3" onChange={onChange} required />
        </div>
        <div className="flex flex-col">
          <label htmlFor="addressUS" className="mb-1 text-sm font-medium">{t('addressUS')}</label>
          <input id="addressUS" name="addressUS" className="border rounded-xl p-3" onChange={onChange} required />
        </div>

        <div className="flex flex-col">
          <label htmlFor="addressVN" className="mb-1 text-sm font-medium">{t('addressVN')}</label>
          <input id="addressVN" name="addressVN" className="border rounded-xl p-3" onChange={onChange} required />
        </div>
        <div className="flex flex-col">
          <label htmlFor="occupation" className="mb-1 text-sm font-medium">{t('occupation')}</label>
          <input id="occupation" name="occupation" className="border rounded-xl p-3" onChange={onChange} required />
        </div>

        <div className="md:col-span-2 flex flex-col">
          <label htmlFor="workInfo" className="mb-1 text-sm font-medium">{t('workInfo')}</label>
          <input id="workInfo" name="workInfo" className="border rounded-xl p-3" onChange={onChange} required />
        </div>

        {/* {t('fatherName')} & DOB side by side */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="fatherName" className="mb-1 text-sm font-medium">{t('fatherName')}</label>
            <input id="fatherName" name="fatherName" className="border rounded-xl p-3" onChange={onChange} required />
          </div>
          <div className="flex flex-col">
            <label htmlFor="fatherDob" className="mb-1 text-sm font-medium">{t('fatherDob')}</label>
            <input id="fatherDob" name="fatherDob" type="date" className="border rounded-xl p-3" onChange={onChange} required />
          </div>
        </div>

        {/* {t('motherName')} & DOB side by side */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="motherName" className="mb-1 text-sm font-medium">{t('motherName')}</label>
            <input id="motherName" name="motherName" className="border rounded-xl p-3" onChange={onChange} required />
          </div>
          <div className="flex flex-col">
            <label htmlFor="motherDob" className="mb-1 text-sm font-medium">{t('motherDob')}</label>
            <input id="motherDob" name="motherDob" type="date" className="border rounded-xl p-3" onChange={onChange} required />
          </div>
        </div>

        {/* Spouse Name & DOB side by side (optional) */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="spouseName" className="mb-1 text-sm font-medium">{t('spouseName')}</label>
            <input id="spouseName" name="spouseName" className="border rounded-xl p-3" onChange={onChange} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="spouseDob" className="mb-1 text-sm font-medium">{t('spouseDob')}</label>
            <input id="spouseDob" name="spouseDob" type="date" className="border rounded-xl p-3" onChange={onChange} />
          </div>
        </div>

        {/* Depart Date & {t('airport')} side by side */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="departDate" className="mb-1 text-sm font-medium">{t('departDate')}</label>
            <input id="departDate" name="departDate" type="date" className="border rounded-xl p-3" onChange={onChange} required />
          </div>
          <div className="flex flex-col">
            <label htmlFor="airport" className="mb-1 text-sm font-medium">{t('airport')}</label>
            <input id="airport" name="airport" className="border rounded-xl p-3" onChange={onChange} required />
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-xl bg-gray-50">
            <label htmlFor="usIdFile" className="block font-medium mb-2">{t('usIdFile')}</label>
            <input id="usIdFile" name="usIdFile" type="file" accept=".jpg,.jpeg,.png,.pdf" className="w-full" onChange={onChange} required />
          </div>
          <div className="p-4 border rounded-xl bg-gray-50">
            <label htmlFor="oldVnPassFile" className="block font-medium mb-2">{t('oldVnPassFile')}</label>
            <input id="oldVnPassFile" name="oldVnPassFile" type="file" accept=".jpg,.jpeg,.png,.pdf" className="w-full" onChange={onChange} required />
          </div>
          <div className="p-4 border rounded-xl bg-gray-50">
            <label htmlFor="photoFile" className="block font-medium mb-2">{t('photoFile')}</label>
            <input id="photoFile" name="photoFile" type="file" accept=".jpg,.jpeg,.png" className="w-full" onChange={onChange} required />
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col">
          <label htmlFor="email" className="mb-1 text-sm font-medium">{t('email')}</label>
          <input id="email" name="email" type="email" placeholder="name@example.com" className="border rounded-xl p-3" onChange={onChange} required />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button disabled={submitting} className="px-6 py-3 rounded-2xl bg-blue-600 text-white">{submitting ? "Submitting..." : "Submit"}</button>
        </div>
      </form>
    </section>
  );
}
