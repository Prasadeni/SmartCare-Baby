// src/components/reports/SymptomsReport.jsx
import React from 'react';
import ReportShell from './ReportShell';
import { formatDate } from '../../utils/formatters';

const RISK = {
  Green:  { label: 'Low Risk',              bar: '#10b981', bg: '#e6f4ea', text: '#137333' },
  Yellow: { label: 'Moderate Risk',         bar: '#f59e0b', bg: '#fff4e5', text: '#b45309' },
  Red:    { label: 'High Risk — Urgent',    bar: '#dc2626', bg: '#ffdad6', text: '#93000a' },
};

export default function SymptomsReport({ baby, assessment }) {
  if (!baby || !assessment) {
    return (
      <ReportShell title="Symptoms Report" baby={baby}>
        <p style={{ padding: 24, color: '#576065' }}>No symptom assessment available for this baby.</p>
      </ReportShell>
    );
  }

  const risk = RISK[assessment.riskLevel] || RISK.Green;
  const present = (assessment.answers || []).filter((a) => a.present);
  const redFlags = assessment.triggeringRedFlags || [];

  return (
    <ReportShell title="Symptoms Report" baby={baby}>
      <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#0b1c30', fontSize: 12 }}>

        {/* Child info */}
        <section className="report-section report-card"
          style={{ background: '#eff4ff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <Field label="Child" value={baby.name} />
            <Field label="DOB" value={formatDate(baby.dob)} />
            <Field label="Assessed" value={formatDate(assessment.assessedAt)} />
            <Field label="Risk Level" value={risk.label} accent={risk.text} />
          </div>
        </section>

        {/* Hero */}
        <section className="report-section report-card"
          style={{
            background: risk.bg, border: `2px solid ${risk.bar}`,
            borderRadius: 16, padding: 20, marginBottom: 16,
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 20, fontWeight: 700, color: risk.text }}>
                {risk.label}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 12, color: risk.text, lineHeight: 1.55, maxWidth: 520 }}>
                {assessment.recommendationText}
              </p>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 40, fontWeight: 700, color: risk.text, lineHeight: 1 }}>
                {assessment.totalScore}
              </div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: risk.text, fontWeight: 700 }}>
                Score
              </div>
            </div>
          </div>
        </section>

        {/* Red flags */}
        {redFlags.length > 0 && (
          <section className="report-section report-card"
            style={{ background: '#ffdad6', border: '1px solid #ba1a1a', borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: '#93000a', marginBottom: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>warning</span>
              Red Flags Detected
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#93000a', fontSize: 11, lineHeight: 1.7 }}>
              {redFlags.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </section>
        )}

        {/* Symptoms */}
        <section className="report-section report-card"
          style={{ background: '#fff', border: '1px solid #e5eeff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 18, fontWeight: 700, margin: 0 }}>
            Symptoms Reported ({present.length})
          </h2>
          <p style={{ fontSize: 11, color: '#576065', margin: '2px 0 12px' }}>
            Symptoms identified during this assessment
          </p>

          {present.length === 0 ? (
            <p style={{ fontSize: 12, color: '#576065' }}>No symptoms were selected.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#eff4ff' }}>
                  <th style={{ ...th, textAlign: 'left' }}>Symptom</th>
                  <th style={th}>Category</th>
                  <th style={th}>Weight</th>
                  <th style={th}>Guidance</th>
                </tr>
              </thead>
              <tbody>
                {present.map((s, i) => (
                  <tr key={i} className="report-card"
                    style={{ background: s.isRedFlag ? '#fff5f3' : '#fff', borderBottom: '1px solid #eff4ff' }}>
                    <td style={{ ...td, color: '#0b1c30', fontWeight: 600 }}>
                      {s.symptomText}
                      {s.isRedFlag && (
                        <span style={{ marginLeft: 6, background: '#ffdad6', color: '#93000a', fontSize: 9, padding: '1px 6px', borderRadius: 999, fontWeight: 700 }}>
                          RED FLAG
                        </span>
                      )}
                    </td>
                    <td style={{ ...td, color: '#576065' }}>{s.category}</td>
                    <td style={{ ...td, textAlign: 'center', fontWeight: 700, color: '#17648d' }}>{s.weight}</td>
                    <td style={{ ...td, color: '#40484e' }}>{s.guidanceText}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Disclaimer */}
        <section className="report-section report-card"
          style={{ background: '#c9e6ff', borderRadius: 12, padding: 14 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <span className="material-symbols-outlined" style={{ color: '#004c6e' }}>shield</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#001e2f', marginBottom: 4 }}>Important</div>
              <div style={{ fontSize: 11, color: '#001e2f', lineHeight: 1.55 }}>
                If your baby has severe symptoms such as difficulty breathing, unresponsiveness, or
                signs of dehydration, seek emergency medical care immediately — do not rely on this report.
              </div>
            </div>
          </div>
        </section>

      </div>
    </ReportShell>
  );
}

const th = { padding: '8px 10px', fontSize: 10, textAlign: 'center', color: '#40484e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 };
const td = { padding: '8px 10px', fontSize: 11 };

function Field({ label, value, accent }) {
  return (
    <div>
      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.8, color: '#576065', fontWeight: 700, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: accent || '#0b1c30' }}>{value}</div>
    </div>
  );
}