// src/pages/HealthHistory.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { historyApi } from '../api/history';
import { babiesApi } from '../api/babies';
import { formatDate, timeAgo } from '../utils/formatters';

// ── Event styling by type ────────────────────────────────────
const EVENT_STYLE = {
  symptom: { dot: 'bg-error', ring: 'bg-error-container', tag: 'bg-error-container text-on-error-container', icon: 'stethoscope' },
  milestone: { dot: 'bg-primary', ring: 'bg-primary-container', tag: 'bg-primary-fixed text-on-primary-fixed', icon: 'flag' },
  mchat: { dot: 'bg-secondary', ring: 'bg-secondary-container', tag: 'bg-secondary-fixed text-on-secondary-fixed', icon: 'psychology_alt' },
  growth: { dot: 'bg-primary', ring: 'bg-primary-container', tag: 'bg-primary-fixed text-on-primary-fixed', icon: 'straighten' },
  vaccination: { dot: 'bg-on-tertiary-container', ring: 'bg-tertiary-container', tag: 'bg-tertiary-fixed text-on-tertiary-fixed', icon: 'vaccines' },
};

// ── Age helper ───────────────────────────────────────────────
function calcAge(dob) {
  if (!dob) return '';
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return '';
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (now.getDate() < birth.getDate()) months--;
  if (months < 0) { years--; months += 12; }
  if (years > 0) return `${years}y ${months}m`;
  if (months > 0) return `${months} mo`;
  const days = Math.max(0, Math.floor((now - birth) / 86400000));
  return `${days} d`;
}

// ── Print-only styles (hidden on screen, active in print) ────
const PRINT_CSS = `
  .print-only { display: none; }

  @media print {
    @page { size: A4; margin: 12mm; }

    html, body {
      background: #ffffff !important;
      color: #1a1a1a !important;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .print-only { display: block !important; }
    .no-print { display: none !important; }

    /* Flatten layout */
    main {
      padding: 0 !important;
      max-width: 100% !important;
    }
    .grid { display: block !important; }
    .grid > * { width: 100% !important; margin-bottom: 18px; }

    /* Neutralize shadows / backgrounds of cards */
    .bg-surface-container-lowest,
    .bg-surface-container-low,
    .bg-secondary-fixed,
    .bg-surface {
      background: #ffffff !important;
      box-shadow: none !important;
    }

    /* Keep events and cards from splitting across pages */
    .timeline-event,
    .print-card,
    .note-card {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    /* Section headings inside print */
    .print-section-title {
      font-size: 15px !important;
      font-weight: 700 !important;
      color: #116a90 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.06em !important;
      border-bottom: 1.5px solid #116a90 !important;
      padding-bottom: 6px !important;
      margin-bottom: 14px !important;
    }

    /* Note cards need a border to be visible on white */
    .note-card {
      border: 1px solid #e5e5e5 !important;
      border-radius: 8px !important;
    }

    /* Remove the vertical timeline line in print */
    .timeline-rail::before { display: none !important; }
    .timeline-rail { padding-left: 0 !important; }
    .timeline-dot { display: none !important; }
  }
`;

export default function HealthHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const babyIdParam = searchParams.get('babyId') || '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [babies, setBabies] = useState([]);
  const [events, setEvents] = useState([]);
  const [doctorPreview, setDoctorPreview] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedBaby, setSelectedBaby] = useState(babyIdParam);

  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [babyList, data] = await Promise.all([
        babiesApi.list(),
        historyApi.get(selectedBaby || undefined),
      ]);
      setBabies(babyList || []);
      setEvents(data.events || []);
      setDoctorPreview(data.doctorPreview || null);
      setNotes(data.notes || []);

      if (!selectedBaby && babyList?.length > 0) {
        const firstId = babyList[0].id;
        setSelectedBaby(firstId);
        setSearchParams({ babyId: firstId });
      }
    } catch (err) {
      setError(err.message || 'Could not load history');
    } finally {
      setLoading(false);
    }
  }, [selectedBaby, setSearchParams]);

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [selectedBaby]);

  const handleBabyChange = (e) => {
    const id = e.target.value;
    setSelectedBaby(id);
    if (id) setSearchParams({ babyId: id });
    else setSearchParams({});
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      const note = await historyApi.addNote({
        content: newNote.trim(),
        babyId: selectedBaby || null,
        category: 'General',
      });
      setNotes((prev) => [note, ...prev]);
      setNewNote('');
    } catch (err) {
      alert(err.message || 'Could not add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await historyApi.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const handleDownloadPDF = () => window.print();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Health Report',
          text: `Summary of recent health records`,
          url: window.location.href,
        });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  };

  // Derived print data
  const selectedBabyObj = babies.find((b) => b.id === selectedBaby) || null;
  const patientName = selectedBabyObj?.name || 'All Babies';
  const generatedOn = new Date().toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <>
      <style>{PRINT_CSS}</style>

      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <div className="no-print">
          <DashboardNavbar activePage="reports" />
        </div>

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-10">

          {/* ── Print-only header & summary ─────────────────── */}
          <div className="print-only">
            {/* Brand header */}
            <div style={{ borderBottom: '2px solid #116a90', paddingBottom: 16, marginBottom: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'linear-gradient(135deg, #116a90, #76b6e3)',
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 24 }}>child_care</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#116a90', lineHeight: 1.15 }}>
                      SmartCare Baby
                    </div>
                    <div style={{ fontSize: 11, color: '#666', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                      Health Report
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 11, color: '#666', lineHeight: 1.6 }}>
                  <div>Generated</div>
                  <div style={{ fontWeight: 600, color: '#333', fontSize: 12 }}>{generatedOn}</div>
                </div>
              </div>

              {/* Patient line */}
              <div style={{ marginTop: 18, display: 'flex', gap: 26, flexWrap: 'wrap', fontSize: 13 }}>
                <div>
                  <span style={{ color: '#666' }}>Patient: </span>
                  <span style={{ fontWeight: 700 }}>{patientName}</span>
                </div>
                {selectedBabyObj?.dob && (
                  <div>
                    <span style={{ color: '#666' }}>DOB: </span>
                    <span style={{ fontWeight: 600 }}>{formatDate(selectedBabyObj.dob)}</span>
                  </div>
                )}
                {selectedBabyObj?.dob && (
                  <div>
                    <span style={{ color: '#666' }}>Age: </span>
                    <span style={{ fontWeight: 600 }}>{calcAge(selectedBabyObj.dob)}</span>
                  </div>
                )}
                {selectedBabyObj?.gender && (
                  <div>
                    <span style={{ color: '#666' }}>Gender: </span>
                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{selectedBabyObj.gender}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Summary stats */}
            {doctorPreview && (
              <div className="print-card" style={{
                marginBottom: 24, padding: 18,
                border: '1px solid #e5e5e5', borderRadius: 12,
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: '#116a90',
                  textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
                }}>
                  Health Summary
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {[
                    { label: 'Current Weight', value: doctorPreview.currentWeight },
                    { label: 'Current Height', value: doctorPreview.currentHeight },
                    { label: 'Head Circumference', value: doctorPreview.currentHead },
                    { label: 'Latest M-CHAT', value: doctorPreview.latestMchat },
                    { label: 'Recent Symptom', value: doctorPreview.recentSymptom },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: 10, background: '#f5f9fc', borderRadius: 8 }}>
                      <div style={{
                        fontSize: 10, color: '#666', textTransform: 'uppercase',
                        letterSpacing: 0.6, marginBottom: 4,
                      }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                        {item.value || '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Header (screen only) */}
          <div className="no-print flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-background mb-1">
                Health Reports & History
              </h2>
              <p className="text-body-md text-on-surface-variant">
                {selectedBaby
                  ? `Review ${babies.find((b) => b.id === selectedBaby)?.name || 'your baby'}'s health records.`
                  : 'Review your family\'s health records.'}
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={handleShare}
                className="flex-1 md:flex-none border-2 border-primary bg-surface-container-lowest text-primary px-5 py-2.5 rounded-full font-label-md text-label-md hover:bg-surface-container-low active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                Share
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex-1 md:flex-none bg-primary text-on-primary px-5 py-2.5 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Download PDF
              </button>
            </div>
          </div>

          {/* Baby selector (screen only) */}
          {babies.length > 0 && (
            <div className="no-print mb-6 flex flex-wrap items-center gap-3">
              <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                Baby:
              </label>
              <select
                value={selectedBaby}
                onChange={handleBabyChange}
                className="rounded-full border border-outline-variant bg-surface-container-lowest px-5 py-2.5 text-body-md focus:outline-none input-glow cursor-pointer"
              >
                <option value="">All babies</option>
                {babies.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}

          {loading ? (
            <LoadingSpinner label="Loading history…" />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : babies.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_4px_20px_rgba(118,182,227,0.05)]">
              <EmptyState
                icon="child_care"
                title="No babies yet"
                message="Add a baby to start tracking health history."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* ── Left: Timeline ── */}
              <div className="lg:col-span-8">
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_20px_rgba(118,182,227,0.05)]">
                  <h3 className="text-headline-sm font-headline-sm text-on-background mb-6 print-section-title">
                    Chronological History
                  </h3>

                  {events.length === 0 ? (
                    <p className="text-body-md text-on-surface-variant text-center py-8">
                      No history recorded yet. Complete an assessment or add a growth record to see events here.
                    </p>
                  ) : (
                    <div className="timeline-rail relative pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container-high">
                      <div className="space-y-4">
                        {events.map((ev) => {
                          const style = EVENT_STYLE[ev.type] || EVENT_STYLE.symptom;
                          return (
                            <div
                              key={`${ev.type}-${ev.id}`}
                              className="timeline-event relative"
                            >
                              {/* Timeline dot */}
                              <div className={`timeline-dot absolute -left-[37px] top-2 h-6 w-6 rounded-full ${style.ring} border-4 border-surface-container-lowest flex items-center justify-center z-10`}>
                                <div className={`h-2 w-2 rounded-full ${style.dot}`}></div>
                              </div>

                              <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-variant hover:shadow-md transition-shadow duration-200">
                                <div className="flex justify-between items-start mb-2 gap-3">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
                                      {style.icon}
                                    </span>
                                    <h4 className="text-body-lg font-semibold text-on-background truncate">
                                      {ev.label}
                                    </h4>
                                  </div>
                                  <span className="text-label-md font-label-md text-on-surface-variant bg-surface px-3 py-1 rounded-full whitespace-nowrap">
                                    {formatDate(ev.date)}
                                  </span>
                                </div>
                                <p className="text-body-sm text-on-surface-variant mb-3">
                                  {ev.description}
                                </p>
                                {ev.tags?.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {ev.tags.map((tag, i) => (
                                      <span
                                        key={i}
                                        className={`${style.tag} px-3 py-1 rounded-full font-label-md text-[10px] uppercase tracking-wider`}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Right: Doctor Preview + Maternal Notes ── */}
              <div className="lg:col-span-4 space-y-6">

                {/* Doctor Preview — screen only (summary appears on print) */}
                <div className="no-print bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_20px_rgba(118,182,227,0.05)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary-container text-on-primary-container p-2 rounded-full">
                      <span className="material-symbols-outlined text-[20px]">medical_information</span>
                    </div>
                    <h3 className="text-headline-sm font-headline-sm text-on-background">
                      Doctor Preview
                    </h3>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mb-5">
                    Quick summary sheet optimized for upcoming pediatric visits.
                  </p>

                  {!doctorPreview ? (
                    <p className="text-body-sm text-on-surface-variant text-center py-4">
                      No data yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <SummaryRow label="Current Weight" value={doctorPreview.currentWeight} />
                      <SummaryRow label="Current Height" value={doctorPreview.currentHeight} />
                      <SummaryRow label="Head Circ." value={doctorPreview.currentHead} />
                      <SummaryRow label="Latest M-CHAT" value={doctorPreview.latestMchat} />
                      <SummaryRow label="Recent Symptom" value={doctorPreview.recentSymptom} last />
                    </div>
                  )}
                </div>

                {/* Maternal Notes */}
                <div className="print-card bg-secondary-fixed rounded-2xl p-6 shadow-[0_4px_20px_rgba(138,72,111,0.08)] border border-secondary-fixed">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-secondary-container text-on-secondary-container p-2 rounded-full">
                      <span className="material-symbols-outlined text-[20px]">edit_note</span>
                    </div>
                    <h3 className="text-headline-sm font-headline-sm text-on-secondary-fixed-variant print-section-title">
                      Maternal Notes
                    </h3>
                  </div>
                  <p className="text-body-sm text-on-secondary-fixed-variant mb-4">
                    Personal reminders and observations to discuss.
                  </p>

                  {/* Notes list */}
                  <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
                    {notes.length === 0 ? (
                      <p className="text-body-sm text-on-secondary-fixed-variant/70 text-center py-4">
                        No notes yet. Add one below.
                      </p>
                    ) : (
                      notes.map((n) => (
                        <div
                          key={n.id}
                          className="note-card bg-surface-container-lowest rounded-xl p-3 group relative"
                        >
                          <p className="text-body-sm text-on-surface pr-6">
                            {n.content}
                          </p>
                          <p className="text-label-md text-on-surface-variant mt-1">
                            {timeAgo(n.createdAt)}
                          </p>
                          <button
                            onClick={() => handleDeleteNote(n.id)}
                            className="no-print absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-error-container hover:text-error flex items-center justify-center text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add note form — screen only */}
                  <form onSubmit={handleAddNote} className="no-print space-y-3">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={2}
                      placeholder="e.g., Ask doctor about solid foods next month..."
                      className="w-full rounded-xl border border-secondary/20 bg-surface-container-lowest px-4 py-3 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary transition-all duration-200 resize-none"
                    />
                    <button
                      type="submit"
                      disabled={addingNote || !newNote.trim()}
                      className="w-full bg-secondary text-on-secondary py-2.5 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                    >
                      {addingNote ? 'Saving…' : 'Add Note'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>

        <div className="no-print">
          <FloatingButtons />
        </div>
      </div>
    </>
  );
}

function SummaryRow({ label, value, last = false }) {
  return (
    <div className={`flex justify-between items-center pb-2 ${last ? '' : 'border-b border-surface-variant'}`}>
      <span className="text-body-md text-on-surface-variant">{label}</span>
      <span className="text-body-md font-semibold text-on-background text-right">{value}</span>
    </div>
  );
}