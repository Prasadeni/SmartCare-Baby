// src/components/reports/MilestonesReport.jsx
import React from 'react';
import ReportShell from './ReportShell';
import { formatDate } from '../../utils/formatters';

export default function MilestonesReport({ baby, assessment }) {
  if (!baby || !assessment) {
    return (
      <ReportShell title="Milestones Report" baby={baby}>
        <p style={{ padding: 24, color: '#576065' }}>No milestone assessment available for this baby.</p>
      </ReportShell>
    );
  }

  const items = assessment.items || [];
  const achieved = items.filter((i) => i.achieved === true);
  const delayed = items.filter((i) => i.achieved === false);
  const unsure = items.filter((i) => i.achieved === null);
  const byArea = items.reduce((acc, i) => {
    (acc[i.area] = acc[i.area] || []).push(i);
    return acc;
  }, {});
  const concerning = delayed.length > 0;

  return (
    <ReportShell title="Milestones Report" baby={baby}>
      <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#0b1c30', fontSize: 12 }}>

        {/* Child info */}
        <section className="report-section report-card"
          style={{ background: '#eff4ff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <Field label="Child" value={baby.name} />
            <Field label="DOB" value={formatDate(baby.dob)} />
            <Field label="Assessed" value={formatDate(assessment.assessedAt)} />
            <Field label="Progress" value={`${assessment.percentAchieved}% achieved`} />
          </div>
        </section>

        {/* Hero */}
        <section className="report-section report-card"
          style={{
            background: concerning ? '#fff4e5' : '#e6f4ea',
            border: `2px solid ${concerning ? '#fed7aa' : '#ceead6'}`,
            borderRadius: 16, padding: 20, marginBottom: 16,
          }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span className="material-symbols-outlined"
              style={{ fontSize: 36, color: concerning ? '#b45309' : '#137333', flexShrink: 0 }}>
              {concerning ? 'warning' : 'verified'}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 20, fontWeight: 700, color: concerning ? '#b45309' : '#137333' }}>
                {concerning ? 'Delays Detected' : 'All Milestones Achieved'}
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#40484e' }}>
                {concerning
                  ? `${delayed.length} item${delayed.length === 1 ? '' : 's'} not yet achieved. Discuss with a pediatric specialist.`
                  : 'Great progress — keep encouraging your baby\'s development.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Mini label="Achieved" value={achieved.length} color="#137333" />
              <Mini label="Delayed" value={delayed.length} color="#b45309" />
              <Mini label="Unsure" value={unsure.length} color="#576065" />
            </div>
          </div>
        </section>

        {/* Area breakdown */}
        <section className="report-section report-card"
          style={{ background: '#fff', border: '1px solid #e5eeff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 18, fontWeight: 700, margin: 0 }}>
            Domain Breakdown
          </h2>
          <p style={{ fontSize: 11, color: '#576065', margin: '2px 0 12px' }}>
            Progress across developmental areas
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {Object.entries(byArea).map(([area, list]) => {
              const ok = list.filter((i) => i.achieved === true).length;
              const total = list.length;
              const pct = total ? (ok / total) * 100 : 0;
              return (
                <div key={area} style={{ background: '#eff4ff', borderRadius: 10, padding: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                    <span>{area}</span>
                    <span style={{ color: ok === total ? '#17648d' : '#576065' }}>{ok}/{total}</span>
                  </div>
                  <div style={{ height: 8, background: '#dce9ff', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%',
                      background: pct === 100 ? '#17648d' : '#76b6e3', borderRadius: 999,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Detailed items */}
        <section className="report-section report-card"
          style={{ background: '#fff', border: '1px solid #e5eeff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 18, fontWeight: 700, margin: 0 }}>
            Detailed Item Responses
          </h2>
          <p style={{ fontSize: 11, color: '#576065', margin: '2px 0 12px' }}>All {items.length} items reviewed</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#eff4ff' }}>
                <th style={th}>Area</th>
                <th style={{ ...th, textAlign: 'left' }}>Milestone</th>
                <th style={th}>Expected</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="report-card"
                  style={{
                    background: it.achieved === false ? '#fff4e5' : '#fff',
                    borderBottom: '1px solid #eff4ff',
                  }}>
                  <td style={{ ...td, fontWeight: 600, color: '#576065' }}>{it.area}</td>
                  <td style={{ ...td, color: '#0b1c30' }}>
                    {it.description}
                    {it.isCritical && (
                      <span style={{ marginLeft: 6, background: '#ffdad6', color: '#93000a', fontSize: 9, padding: '1px 6px', borderRadius: 999, fontWeight: 700 }}>
                        CRITICAL
                      </span>
                    )}
                  </td>
                  <td style={{ ...td, textAlign: 'center', color: '#576065' }}>
                    {it.expectedAgeMonths != null ? `${it.expectedAgeMonths} mo` : '—'}
                  </td>
                  <td style={{ ...td, textAlign: 'center' }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
                      textTransform: 'uppercase',
                      background: it.achieved === true ? '#c9e6ff' : it.achieved === false ? '#ffdad6' : '#dbe4ea',
                      color: it.achieved === true ? '#001e2f' : it.achieved === false ? '#93000a' : '#141d21',
                    }}>
                      {it.achieved === true ? 'Achieved' : it.achieved === false ? 'Not yet' : 'Unsure'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Disclaimer */}
        <section className="report-section report-card"
          style={{ background: '#c9e6ff', borderRadius: 12, padding: 14 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <span className="material-symbols-outlined" style={{ color: '#004c6e' }}>shield</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#001e2f', marginBottom: 4 }}>Clinical Disclaimer</div>
              <div style={{ fontSize: 11, color: '#001e2f', lineHeight: 1.55 }}>
                Milestone checklists are developmental screening tools, not diagnostic instruments.
                Delays may resolve on their own — always discuss concerns with a pediatrician.
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

function Mini({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, color: '#576065', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 }}>{label}</div>
    </div>
  );
}