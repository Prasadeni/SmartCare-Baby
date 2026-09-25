// src/components/reports/MChatReport.jsx
import React from 'react';
import ReportShell from './ReportShell';
import { formatDate } from '../../utils/formatters';

const RISK = {
  Low:    { label: 'Low Risk',      range: '0 – 2',   bar: '#17648d', bg: '#c9e6ff', soft: '#eff4ff', text: '#001e2f' },
  Medium: { label: 'Moderate Risk', range: '3 – 7',   bar: '#8a486f', bg: '#ffd8ea', soft: '#fff1f7', text: '#3a0329' },
  High:   { label: 'High Risk',     range: '8 – 20',  bar: '#ba1a1a', bg: '#ffdad6', soft: '#fff5f3', text: '#93000a' },
};

function calcAge(dob) {
  if (!dob) return '';
  const b = new Date(dob);
  if (Number.isNaN(b.getTime())) return '';
  const now = new Date();
  let y = now.getFullYear() - b.getFullYear();
  let m = now.getMonth() - b.getMonth();
  if (now.getDate() < b.getDate()) m--;
  if (m < 0) { y--; m += 12; }
  if (y > 0) return `${y}y ${m}m`;
  if (m > 0) return `${m} months`;
  return `${Math.max(0, Math.floor((now - b) / 86400000))} days`;
}

export default function MChatReport({ baby, assessment, history = [] }) {
  if (!baby || !assessment) {
    return (
      <ReportShell title="M-CHAT-R Report" baby={baby}>
        <p style={{ padding: 24, color: '#576065' }}>No M-CHAT-R assessment available for this baby.</p>
      </ReportShell>
    );
  }

  const risk = RISK[assessment.riskLevel] || RISK.Low;
  const answers = assessment.answers || [];
  const total = answers.length || 20;
  const answered = answers.filter((a) => a.response !== null).length;
  const riskAnswers = answers.filter((a) => a.isRisk);
  const nonRiskAnswers = answers.filter((a) => !a.isRisk && a.response !== null);
  const riskCount = assessment.totalRiskScore;
  const pct = total > 0 ? (riskCount / total) * 100 : 0;

  return (
    <ReportShell title="M-CHAT-R Report" baby={baby}>
      <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#0b1c30', fontSize: 12 }}>

        {/* ── Child info ─────────────────────────────── */}
        <section className="report-section report-card"
          style={{ background: '#eff4ff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'center' }}>
            {baby.photoUrl ? (
              <img src={baby.photoUrl} alt={baby.name}
                style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: 72, height: 72, borderRadius: '50%', background: '#17648d', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 28, fontFamily: 'Quicksand, sans-serif',
              }}>{baby.name?.[0]?.toUpperCase() || '?'}</div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <Info label="Child Name" value={baby.name} big />
              <Info label="Date of Birth" value={formatDate(baby.dob)} />
              <Info label="Age at Screen" value={calcAge(baby.dob)} />
              <Info label="Gender" value={baby.gender || '—'} capitalize />
            </div>
          </div>
        </section>

        {/* ── Hero score ─────────────────────────────── */}
        <section className="report-section report-card"
          style={{ background: risk.bg, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 20, fontWeight: 700, color: risk.text }}>
                  Screening Summary
                </span>
                <span style={{
                  background: risk.bar, color: '#fff', padding: '3px 10px',
                  borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6,
                }}>{risk.label} · {risk.range}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                <Badge icon="task_alt" label={`${answered} of ${total} Answered`} />
                <Badge icon="bar_chart" label={`${riskCount} / ${total} Risk Score`} />
              </div>
              <p style={{ margin: 0, fontSize: 12, color: risk.text, lineHeight: 1.55 }}>
                {assessment.actionPlan}
              </p>
            </div>
            {/* Circular progress */}
            <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
              <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="transparent" stroke="#fff" strokeWidth="12" />
                <circle cx="60" cy="60" r="50" fill="transparent" stroke={risk.bar} strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="314.16"
                  strokeDashoffset={314.16 - (314.16 * pct) / 100} />
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
                  {riskCount}
                </span>
                <span style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: '#576065' }}>
                  of {total} Risk
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Scoring breakdown ─────────────────────── */}
        <section className="report-section report-card"
          style={{ background: '#fff', border: '1px solid #e5eeff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <h2 style={h2}>Scoring Breakdown</h2>
          <p style={sub}>Response distribution across the {total}-item M-CHAT-R protocol</p>

          <div style={{ display: 'flex', gap: 4, height: 14, marginTop: 10, marginBottom: 12 }}>
            {answers.map((a, i) => (
              <div key={i} title={`Q${a.questionNumber}`}
                style={{
                  flex: 1, borderRadius: 4,
                  background: a.isRisk ? risk.bar : '#76b6e3',
                }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: 11, color: '#40484e' }}>
            <Legend color={risk.bar} label={`Risk-Indicating (${riskAnswers.length})`} />
            <Legend color="#76b6e3" label={`No Risk Indicator (${nonRiskAnswers.length})`} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 14 }}>
            <Stat label="Total Questions" value={total} sub="Official protocol" />
            <Stat label="Completed" value={answered} sub="Submitted" />
            <Stat label="Risk Responses" value={riskCount} sub="Score-impacting" accent={risk.bar} />
            <Stat label="Risk Category" value={risk.label.replace(' Risk','')} sub="Follow-up advised" accent={risk.bar} />
          </div>
        </section>

        {/* ── Risk reference ─────────────────────────── */}
        <section className="report-section report-card"
          style={{ background: '#fff', border: '1px solid #e5eeff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <h2 style={h2}>Risk Level Reference</h2>
          <p style={sub}>Standard clinical thresholds defined by the M-CHAT-R™ validation framework</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 10 }}>
            {[
              { key: 'Low', title: 'Low Clinical Indication', body: 'Few risk indicators. Rescreen at 24 months or during routine developmental surveillance.', action: 'Routine surveillance' },
              { key: 'Medium', title: 'Follow-Up Recommended', body: 'Some responses indicate potential social communication variance. Consider an M-CHAT-R Follow-Up Interview.', action: 'Clinical follow-up interview' },
              { key: 'High', title: 'Prompt Evaluation Needed', body: 'High score warrants immediately scheduling a comprehensive developmental evaluation.', action: 'Immediate diagnostic referral' },
            ].map((r) => {
              const active = assessment.riskLevel === r.key;
              const meta = RISK[r.key];
              return (
                <div key={r.key} className="report-card"
                  style={{
                    padding: 12, borderRadius: 12,
                    background: active ? meta.bg : '#eff4ff',
                    border: active ? `2px solid ${meta.bar}` : '1px solid #e5eeff',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6,
                      padding: '3px 8px', borderRadius: 999,
                      background: active ? meta.bar : '#fff',
                      color: active ? '#fff' : meta.text,
                    }}>{meta.label}</span>
                    <strong style={{ fontSize: 13, color: meta.text }}>{meta.range}</strong>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: meta.text, marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 10, color: active ? meta.text : '#40484e', lineHeight: 1.5 }}>{r.body}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, marginTop: 6, color: meta.text }}>
                    Action: {r.action}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Risk-indicating responses ──────────────── */}
        {riskAnswers.length > 0 && (
          <section className="report-section report-card"
            style={{ background: '#fff', border: '1px solid #e5eeff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <h2 style={h2}>Risk-Indicating Responses</h2>
            <p style={sub}>These {riskAnswers.length} responses contributed to the screening score</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
              {riskAnswers.map((a) => (
                <div key={a.questionNumber} className="report-card"
                  style={{ background: risk.bg, borderRadius: 12, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: risk.text }}>
                      Question {String(a.questionNumber).padStart(2, '0')}
                    </span>
                    <span style={{
                      background: risk.bar, color: '#fff', fontSize: 10, fontWeight: 700,
                      padding: '2px 8px', borderRadius: 999,
                    }}>{a.response ? 'YES' : 'NO'} (Risk)</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: risk.text, marginBottom: 4 }}>
                    "{a.text}"
                  </div>
                  {a.isReverseScored && (
                    <div style={{ fontSize: 10, color: risk.text, opacity: 0.85 }}>
                      <strong>Note:</strong> This question is reverse-scored — a "Yes" response indicates risk.
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, background: '#eff4ff', borderRadius: 10, padding: 10, fontSize: 11, color: '#40484e' }}>
              <strong>Clinical note:</strong> These are screening indicators only and do not represent a diagnosis.
              Many children who trigger 3–7 items test typically upon pediatric review.
            </div>
          </section>
        )}

        {/* ── Full responses table ───────────────────── */}
        {answers.length > 0 && (
          <section className="report-section report-card"
            style={{ background: '#fff', border: '1px solid #e5eeff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <h2 style={h2}>Detailed M-CHAT-R Responses</h2>
            <p style={sub}>All {answers.length} responses from this screening</p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginTop: 8 }}>
              <thead>
                <tr style={{ background: '#eff4ff' }}>
                  <th style={th}>#</th>
                  <th style={{ ...th, textAlign: 'left' }}>Screening Question</th>
                  <th style={th}>Answer</th>
                  <th style={th}>Indicator</th>
                </tr>
              </thead>
              <tbody>
                {answers.map((a) => (
                  <tr key={a.questionNumber} className="report-card"
                    style={{
                      background: a.isRisk ? risk.soft : '#fff',
                      borderBottom: '1px solid #eff4ff',
                    }}>
                    <td style={{ ...td, fontWeight: 700, color: a.isRisk ? risk.bar : '#576065' }}>
                      {String(a.questionNumber).padStart(2, '0')}
                    </td>
                    <td style={{ ...td, color: '#0b1c30' }}>{a.text}</td>
                    <td style={{ ...td, textAlign: 'center', fontWeight: 700, color: a.isRisk ? risk.bar : '#17648d' }}>
                      {a.response === null ? '—' : a.response ? 'Yes' : 'No'}
                    </td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
                        background: a.isRisk ? risk.bar : '#c9e6ff',
                        color: a.isRisk ? '#fff' : '#001e2f',
                        textTransform: 'uppercase', letterSpacing: 0.4,
                      }}>{a.isRisk ? 'Risk Indicator' : 'No Risk'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* ── Recommended follow-up ─────────────────── */}
        <section className="report-section report-card"
          style={{ background: '#eff4ff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{
              width: 46, height: 46, borderRadius: '50%', background: '#17648d', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>stethoscope</span>
            </div>
            <div>
              <h2 style={{ ...h2, marginBottom: 4 }}>Recommended Clinical Follow-Up</h2>
              <p style={{ margin: 0, fontSize: 12, color: '#40484e', lineHeight: 1.6 }}>
                Based on the screening result of <strong>{riskCount}</strong>, the American Academy of Pediatrics
                {assessment.followUpNeeded
                  ? ' recommends an M-CHAT-R Follow-Up Interview administered by a qualified healthcare professional.'
                  : ' advises continued routine developmental surveillance at well-child visits.'}
              </p>
            </div>
          </div>
        </section>

        {/* ── Trend (only if 2+ assessments) ─────────── */}
        {history.length >= 2 && (
          <section className="report-section report-card"
            style={{ background: '#fff', border: '1px solid #e5eeff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <h2 style={h2}>Screening History & Trend</h2>
            <p style={sub}>Longitudinal M-CHAT-R scores across pediatric milestones</p>
            <TrendChart history={history} />
          </section>
        )}

        {/* ── Disclaimer ─────────────────────────────── */}
        <section className="report-section report-card"
          style={{ background: '#c9e6ff', borderRadius: 12, padding: 14 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <span className="material-symbols-outlined" style={{ color: '#004c6e', flexShrink: 0 }}>shield</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#001e2f', marginBottom: 4 }}>
                Clinical Disclaimer & Guidance
              </div>
              <div style={{ fontSize: 11, color: '#001e2f', lineHeight: 1.55 }}>
                M-CHAT-R is an evidence-based screening tool and is <strong>not a diagnostic test</strong>.
                A screening result does not confirm or rule out autism spectrum disorder (ASD). Results are
                intended solely to inform discussions with a licensed pediatrician or developmental specialist.
              </div>
            </div>
          </div>
        </section>

      </div>
    </ReportShell>
  );
}

// ── Helpers ────────────────────────────────────────────────

const h2 = { fontFamily: 'Quicksand, sans-serif', fontSize: 18, fontWeight: 700, margin: 0, color: '#0b1c30' };
const sub = { fontSize: 11, color: '#576065', margin: '2px 0 0' };
const th = { padding: '8px 10px', fontSize: 10, textAlign: 'center', color: '#40484e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 };
const td = { padding: '8px 10px', verticalAlign: 'middle', fontSize: 11 };

function Info({ label, value, big = false, capitalize = false }) {
  return (
    <div>
      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.8, color: '#576065', fontWeight: 700, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{
        fontFamily: big ? 'Quicksand, sans-serif' : 'Nunito Sans, sans-serif',
        fontSize: big ? 18 : 13, fontWeight: 700, color: '#0b1c30',
        textTransform: capitalize ? 'capitalize' : 'none',
      }}>{value}</div>
    </div>
  );
}

function Badge({ icon, label }) {
  return (
    <span style={{
      background: '#fff', borderRadius: 999, padding: '3px 10px',
      fontSize: 10, fontWeight: 700, color: '#0b1c30',
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{icon}</span>
      {label}
    </span>
  );
}

function Legend({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color }}></span>
      {label}
    </span>
  );
}

function Stat({ label, value, sub, accent }) {
  return (
    <div style={{ background: '#eff4ff', borderRadius: 10, padding: 10, textAlign: 'center' }}>
      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.6, color: '#576065', fontWeight: 700, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 22, fontWeight: 700, color: accent || '#0b1c30', lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 9, color: '#576065', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function TrendChart({ history }) {
  // history is DESC by assessedAt; reverse to chronological
  const series = [...history].reverse();
  const W = 700, H = 160, P = { l: 50, r: 40, t: 20, b: 30 };
  const maxScore = 20;
  const n = series.length;
  const xAt = (i) => P.l + (i / Math.max(1, n - 1)) * (W - P.l - P.r);
  const yAt = (s) => P.t + (1 - s / maxScore) * (H - P.t - P.b);
  const points = series.map((h, i) => ({ x: xAt(i), y: yAt(h.totalRiskScore), ...h }));
  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div style={{ marginTop: 10 }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Threshold lines */}
        <line x1={P.l} x2={W - P.r} y1={yAt(8)} y2={yAt(8)} stroke="#c0c7cf" strokeDasharray="4 4" />
        <text x={W - P.r + 4} y={yAt(8) + 3} fontSize="9" fill="#576065">Score 8 (High)</text>
        <line x1={P.l} x2={W - P.r} y1={yAt(3)} y2={yAt(3)} stroke="#c0c7cf" strokeDasharray="4 4" />
        <text x={W - P.r + 4} y={yAt(3) + 3} fontSize="9" fill="#576065">Score 3 (Moderate)</text>

        {/* Line */}
        <polyline points={polyline} fill="none" stroke="#8a486f" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Points */}
        {points.map((p, i) => {
          const last = i === points.length - 1;
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={last ? 6 : 4}
                fill={last ? '#8a486f' : '#fff'} stroke="#8a486f" strokeWidth="2" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="700" fill="#8a486f">
                {p.totalRiskScore}
              </text>
              <text x={p.x} y={H - 8} textAnchor="middle" fontSize="9" fill="#576065">
                {new Date(p.assessedAt).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}