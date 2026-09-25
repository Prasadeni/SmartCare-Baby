// src/components/reports/GrowthReport.jsx
import React from 'react';
import ReportShell from './ReportShell';
import { formatDate } from '../../utils/formatters';

function calcAge(dob) {
  if (!dob) return '';
  const b = new Date(dob);
  const now = new Date();
  let y = now.getFullYear() - b.getFullYear();
  let m = now.getMonth() - b.getMonth();
  if (now.getDate() < b.getDate()) m--;
  if (m < 0) { y--; m += 12; }
  return y > 0 ? `${y}y ${m}m` : `${m} months`;
}

export default function GrowthReport({ baby, records = [] }) {
  if (!baby) {
    return (
      <ReportShell title="Growth Report" baby={baby}>
        <p style={{ padding: 24, color: '#576065' }}>No baby selected.</p>
      </ReportShell>
    );
  }

  const sorted = [...records].sort((a, b) => a.babyAgeMonths - b.babyAgeMonths);
  const latest = sorted[sorted.length - 1];

  return (
    <ReportShell title="Growth Report" baby={baby}>
      <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#0b1c30', fontSize: 12 }}>

        {/* Child info */}
        <section className="report-section report-card"
          style={{ background: '#eff4ff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <Field label="Child" value={baby.name} />
            <Field label="DOB" value={formatDate(baby.dob)} />
            <Field label="Age" value={calcAge(baby.dob)} />
            <Field label="Measurements" value={`${sorted.length} logged`} />
          </div>
        </section>

        {/* Latest snapshot */}
        {latest && (
          <section className="report-section report-card"
            style={{ background: '#fff', border: '1px solid #e5eeff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 18, fontWeight: 700, margin: 0 }}>
              Latest Measurement
            </h2>
            <p style={{ fontSize: 11, color: '#576065', margin: '2px 0 12px' }}>
              Recorded {formatDate(latest.recordedAt)} · Age {latest.babyAgeMonths} months
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <MetricBox label="Weight" value={`${latest.weightKg} kg`} pct={latest.weightPercentile} color="#17648d" />
              <MetricBox label="Height" value={`${latest.heightCm} cm`} pct={latest.heightPercentile} color="#8a486f" />
              <MetricBox label="Head" value={`${latest.headCircumferenceCm} cm`} pct={latest.headPercentile} color="#576065" />
            </div>
          </section>
        )}

        {/* Chart */}
        {sorted.length >= 2 && (
          <section className="report-section report-card"
            style={{ background: '#fff', border: '1px solid #e5eeff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 18, fontWeight: 700, margin: 0 }}>
              Growth Trend
            </h2>
            <p style={{ fontSize: 11, color: '#576065', margin: '2px 0 12px' }}>
              Weight, height and head circumference over time
            </p>
            <GrowthChart records={sorted} />
          </section>
        )}

        {/* Table */}
        <section className="report-section report-card"
          style={{ background: '#fff', border: '1px solid #e5eeff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 18, fontWeight: 700, margin: 0 }}>
            Full Measurement History
          </h2>
          <p style={{ fontSize: 11, color: '#576065', margin: '2px 0 12px' }}>
            All {sorted.length} recorded entries
          </p>
          {sorted.length === 0 ? (
            <p style={{ fontSize: 12, color: '#576065' }}>No growth records yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#eff4ff' }}>
                  <th style={th}>Age</th>
                  <th style={th}>Date</th>
                  <th style={th}>Weight</th>
                  <th style={th}>Height</th>
                  <th style={th}>Head</th>
                  <th style={th}>W%ile</th>
                  <th style={th}>H%ile</th>
                  <th style={th}>HC%ile</th>
                </tr>
              </thead>
              <tbody>
                {[...sorted].reverse().map((r, i) => (
                  <tr key={i} className="report-card" style={{ borderBottom: '1px solid #eff4ff' }}>
                    <td style={{ ...td, fontWeight: 700 }}>{r.babyAgeMonths} mo</td>
                    <td style={{ ...td, color: '#576065' }}>{formatDate(r.recordedAt)}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{r.weightKg} kg</td>
                    <td style={{ ...td, fontWeight: 600 }}>{r.heightCm} cm</td>
                    <td style={{ ...td, fontWeight: 600 }}>{r.headCircumferenceCm} cm</td>
                    <td style={{ ...td, textAlign: 'center' }}>{r.weightPercentile}th</td>
                    <td style={{ ...td, textAlign: 'center' }}>{r.heightPercentile}th</td>
                    <td style={{ ...td, textAlign: 'center' }}>{r.headPercentile}th</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

      </div>
    </ReportShell>
  );
}

const th = { padding: '8px 10px', fontSize: 10, textAlign: 'center', color: '#40484e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 };
const td = { padding: '8px 10px', fontSize: 11 };

function Field({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.8, color: '#576065', fontWeight: 700, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#0b1c30' }}>{value}</div>
    </div>
  );
}

function MetricBox({ label, value, pct, color }) {
  return (
    <div style={{ background: '#eff4ff', borderRadius: 10, padding: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.6, color: '#576065', fontWeight: 700, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 20, fontWeight: 700, color, lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: '#576065', marginTop: 4 }}>{pct}th percentile</div>
    </div>
  );
}

function GrowthChart({ records }) {
  const W = 700, H = 200, P = { l: 45, r: 20, t: 15, b: 30 };

  const allW = records.map((r) => r.weightKg);
  const allH = records.map((r) => r.heightCm);
  const allHC = records.map((r) => r.headCircumferenceCm);

  const ranges = {
    weight: [Math.min(...allW) - 1, Math.max(...allW) + 1],
    height: [Math.min(...allH) - 2, Math.max(...allH) + 2],
    head:   [Math.min(...allHC) - 2, Math.max(...allHC) + 2],
  };

  const xAt = (i) => P.l + (i / Math.max(1, records.length - 1)) * (W - P.l - P.r);
  const yAt = (v, range) => P.t + (1 - (v - range[0]) / (range[1] - range[0])) * (H - P.t - P.b);

  const drawLine = (key, color) => {
    const range = ranges[key];
    const pts = records.map((r, i) => `${xAt(i)},${yAt(r[key === 'weight' ? 'weightKg' : key === 'height' ? 'heightCm' : 'headCircumferenceCm'], range)}`).join(' ');
    return <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* X labels */}
      {records.map((r, i) => (
        <text key={i} x={xAt(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="#576065">
          {r.babyAgeMonths}mo
        </text>
      ))}

      {drawLine('weight', '#17648d')}
      {drawLine('height', '#8a486f')}
      {drawLine('head', '#576065')}

      {/* Legend */}
      <g transform={`translate(${P.l}, 5)`}>
        <circle cx="0" cy="0" r="3" fill="#17648d" /><text x="8" y="3" fontSize="10" fill="#40484e">Weight</text>
        <circle cx="70" cy="0" r="3" fill="#8a486f" /><text x="78" y="3" fontSize="10" fill="#40484e">Height</text>
        <circle cx="140" cy="0" r="3" fill="#576065" /><text x="148" y="3" fontSize="10" fill="#40484e">Head</text>
      </g>
    </svg>
  );
}