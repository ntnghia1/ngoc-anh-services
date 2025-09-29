// src/Privacy.jsx
import React from "react";
import { makeT } from "./translator";

export default function Privacy({ t, lang = 'en' }) {
  const tt = t || makeT(lang);
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-slate-700">
      <h1 className="text-2xl font-bold text-emerald-700">{tt("privacyTitle")}</h1>

      <p>{tt("privacyIntro")}</p>

      <h2 className="text-xl font-semibold">{tt("privacySection1")}</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>{tt("privacySection1a")}</li>
        <li>{tt("privacySection1b")}</li>
        <li>{tt("privacySection1c")}</li>
      </ul>

      <h2 className="text-xl font-semibold">{tt("privacySection2")}</h2>
      <p>{tt("privacySection2intro")}</p>
      <ul className="list-disc list-inside space-y-1">
        <li>{tt("privacySection2a")}</li>
        <li>{tt("privacySection2b")}</li>
        <li>{tt("privacySection2c")}</li>
      </ul>

      <h2 className="text-xl font-semibold">{tt("privacySection3")}</h2>
      <p>{tt("privacySection3text")}</p>

      <h2 className="text-xl font-semibold">{tt("privacySection4")}</h2>
      <p>{tt("privacySection4text")}</p>

      <h2 className="text-xl font-semibold">{tt("privacySection5")}</h2>
      <p>{tt("privacySection5text")}</p>

      <h2 className="text-xl font-semibold">{tt("privacySection6")}</h2>
      <p>
        {tt("privacySection6text")} <strong>ntnghia00@yahoo.com</strong>
      </p>

      <p className="text-sm text-gray-500">
        {tt("privacyUpdated")}: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
