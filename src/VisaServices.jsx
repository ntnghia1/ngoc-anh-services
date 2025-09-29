import React, { useState } from "react";
import PrivacyModal from "./components/PrivacyModal";
import { saveSubmission } from "./lib/saveSubmission";

function makeVisaTx() {
  const a = Math.floor(100 + Math.random() * 900);
  const b = Math.floor(100 + Math.random() * 900);
  return `VISA-${a}-${b}`;
}

export default function VisaServices({ t }) {
  const [txId, setTxId] = useState(() => makeVisaTx());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const VISA_FEE = 120;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const fd = new FormData(e.currentTarget);
      const obj = Object.fromEntries(fd.entries());

      // --- Send emails to customer + admin via Netlify function ---
      const resp = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toCustomer: true,
          toAdmin: true,
          customer: {
            email: obj.email || "",
            phone: obj.phone || "",
            name: obj.fullName || "",
          },
          txId,
          details: {
            form: "Visa Services",
            visaType: obj.visaType || "",
            fullName: obj.fullName || "",
            dateOfBirth: obj.dob || "",
            nationality: obj.nationality || "",
            issuingCountry: obj.issuingCountry || "",
            passportNumber: obj.passportNumber || "",
            phone: obj.phone || "",
            email: obj.email || "",
          },
          zelle: { adminEmail: "ntnghia00@yahoo.com" },
        }),
      });

      if (!resp.ok) {
        // Soft-fail: continue and show success UI so user isn’t stuck.
        console.warn("send-email failed", resp.status);
      }

      // --- Save to Supabase (no-op if env not configured) ---
      try {
        const rec = {
          tx_id: txId,
          email: obj.email || "",
          phone: obj.phone || "",
          full_name: obj.fullName || "",
          date_of_birth: obj.dob || null,
          nationality: obj.nationality || "",
          issuing_country: obj.issuingCountry || "",
          passport_number: obj.passportNumber || "",
          visa_type: obj.visaType || "",
          id_url: null,
          raw: obj,
        };
        await saveSubmission("visa", rec);
      } catch (_) {
        // ignore
      }

      setSubmitted(true);
      e.currentTarget.reset();
      setTxId(makeVisaTx());
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Intro */}
      <div className="border rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-2">
          {t ? t("visaIntroTitle") : "Visa Introduction"}
        </h2>
        <p className="text-slate-700 leading-relaxed">
          {t
            ? t("visaIntro")
            : "Giấy miễn thị thực (Visa 5 năm) cho người Việt Nam định cư ở nước ngoài hoặc thân nhân. Tạm trú tối đa 6 tháng mỗi lần nhập cảnh."}
        </p>
      </div>

      {/* Zelle memo + fee */}
      <div className="rounded-xl border p-4 bg-blue-50">
        <p className="font-medium">
          Please use this <strong>Transaction ID</strong> as your Zelle memo:
        </p>
        <div className="flex items-center gap-2 mt-2">
          <code className="px-3 py-1 rounded-lg bg-white border">{txId}</code>
          <button
            type="button"
            className="px-3 py-1 rounded-lg border bg-white"
            onClick={() => navigator.clipboard.writeText(txId)}
          >
            Copy
          </button>
        </div>
        <p className="mt-3">
          <strong>Visa fee:</strong> ${VISA_FEE}
        </p>
        <p>
          Send via <strong>Zelle</strong> to{" "}
          <strong>Ngoc Anh Services</strong> at <strong>720-226-4972</strong>.
        </p>
      </div>

      {/* Success banner */}
      {submitted && (
        <div className="rounded-xl border p-4 bg-green-50 text-green-800">
          <p className="font-semibold mb-1">
            {t
              ? t("success1")
              : "Thanks! Your request was submitted. We’ll email/text you next steps."}
          </p>
          <p className="text-sm">
            {t
              ? t("success2")?.replace("{txId}", txId)
              : `Please include Transaction ID ${txId} in your Zelle memo.`}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4 border rounded-xl p-4">
        {/* Contact */}
        <h3 className="text-base font-semibold">
          {t ? t("contactInformation") : "Contact Information"}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm font-medium">
              {t ? t("email") : "Email"}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="border rounded-xl p-3"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-1 text-sm font-medium">
              {t ? t("phone") : "Phone Number"}
            </label>
            <input id="phone" name="phone" className="border rounded-xl p-3" />
          </div>
        </div>

        {/* Applicant */}
        <h3 className="text-base font-semibold">
          {t ? t("applicantInfo") : "Applicant Information"}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="fullName" className="mb-1 text-sm font-medium">
              {t ? t("fullName") : "Full Name"}
            </label>
            <input
              id="fullName"
              name="fullName"
              className="border rounded-xl p-3"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="dob" className="mb-1 text-sm font-medium">
              {t ? t("dob") : "Date of Birth"}
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              className="border rounded-xl p-3"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="nationality"
              className="mb-1 text-sm font-medium"
            >
              {t ? t("nationality") : "Nationality"}
            </label>
            <input
              id="nationality"
              name="nationality"
              className="border rounded-xl p-3"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="issuingCountry"
              className="mb-1 text-sm font-medium"
            >
              {t ? t("issuingCountry") : "Issuing Country"}
            </label>
            <input
              id="issuingCountry"
              name="issuingCountry"
              defaultValue="United States"
              className="border rounded-xl p-3"
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label
              htmlFor="passportNumber"
              className="mb-1 text-sm font-medium"
            >
              {t ? t("passportNumber") : "Passport Number"}
            </label>
            <input
              id="passportNumber"
              name="passportNumber"
              className="border rounded-xl p-3"
            />
          </div>
        </div>

        {/* Visa Type */}
        <h3 className="text-base font-semibold">
          {t ? t("visaType") : "Visa Type"}
        </h3>
        <div>
          <select
            id="visaType"
            name="visaType"
            className="border rounded-xl p-3 w-full"
            defaultValue="Visa Exception, 5 Years"
          >
            <option value="Visa Exception, 5 Years">
              Visa Exception, 5 Years
            </option>
            <option value="Tourist Visa">Tourist Visa</option>
            <option value="Business Visa">Business Visa</option>
          </select>
        </div>

        {/* Privacy */}
        <div className="flex items-center gap-3">
          <input id="agree" type="checkbox" required />
          <label htmlFor="agree" className="text-sm">
            I agree to the{" "}
            <button
              type="button"
              className="underline"
              onClick={() => setPrivacyOpen(true)}
            >
              Privacy Policy
            </button>
            .
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-sm"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}
