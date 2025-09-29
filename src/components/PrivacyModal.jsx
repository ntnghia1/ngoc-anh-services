// src/components/PrivacyModal.jsx
import React from "react";

export default function PrivacyModal({ open, onClose, t }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white max-w-2xl w-[92vw] rounded-xl p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-full w-8 h-8 grid place-items-center text-gray-600 hover:bg-gray-100"
          aria-label="Close privacy policy"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">{t ? t('privacyPolicy') : 'Privacy Policy'}</h2>

        <div className="space-y-4 text-slate-700 max-h-[70vh] overflow-auto pr-2">
          <p>{t ? t('privacyIntro') : 'We take privacy seriously.'}</p>
          <h3 className="text-lg font-medium">{t ? t('privacySection1') : 'What we collect'}</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>{t ? t('privacySection1a') : 'Personal data needed for service'}</li>
            <li>{t ? t('privacySection1b') : 'Documents you upload'}</li>
            <li>{t ? t('privacySection1c') : 'Contact details for notifications'}</li>
          </ul>
          <h3 className="text-lg font-medium">{t ? t('privacySection2') : 'How we use data'}</h3>
          <p>{t ? t('privacySection2intro') : 'We only use data for processing requests.'}</p>
          <h3 className="text-lg font-medium">{t ? t('privacySection3') : 'Storage'}</h3>
          <p>{t ? t('privacySection3text') : 'Files are stored securely in our storage provider.'}</p>
          <h3 className="text-lg font-medium">{t ? t('privacySection4') : 'Sharing'}</h3>
          <p>{t ? t('privacySection4text') : 'We do not share personal data unless required.'}</p>
          <h3 className="text-lg font-medium">{t ? t('privacySection5') : 'Retention'}</h3>
          <p>{t ? t('privacySection5text') : 'We keep data only as long as necessary.'}</p>
          <h3 className="text-lg font-medium">{t ? t('privacySection6') : 'Contact'}</h3>
          <p>{t ? t('privacySection6text') : 'Contact us at: ntnghia00@yahoo.com'}</p>
          <p className="text-xs text-gray-500">
            {t ? t('privacyUpdated') : 'Last updated'}: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
