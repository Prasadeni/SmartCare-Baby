// src/pages/ReportViewer.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import MChatReport from '../components/reports/MChatReport';
import MilestonesReport from '../components/reports/MilestonesReport';
import SymptomsReport from '../components/reports/SymptomsReport';
import GrowthReport from '../components/reports/GrowthReport';
import FullReport from '../components/reports/FullReport';
import { babiesApi } from '../api/babies';
import { growthApi } from '../api/growth';
import { symptomsApi, milestonesApi, mchatApi } from '../api/assessments';

export default function ReportViewer() {
  const { type, babyId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const baby = await babiesApi.get(babyId);
        const payload = { baby };

        if (type === 'mchat' || type === 'full') {
          const list = await mchatApi.list(babyId).catch(() => []);
          const latest = list?.[0];
          let full = null;
          if (latest) {
            full = await mchatApi.get(latest.id).catch(() => null);
          }
          payload.mchat = full;
          payload.mchatHistory = list || [];
        }

        if (type === 'milestones' || type === 'full') {
          const list = await milestonesApi.list(babyId).catch(() => []);
          const latest = list?.[0];
          if (latest) {
            payload.milestones = await milestonesApi.get(latest.id).catch(() => null);
          }
        }

        if (type === 'symptoms' || type === 'full') {
          const list = await symptomsApi.history(babyId).catch(() => []);
          const latest = list?.[0];
          if (latest) {
            payload.symptoms = await symptomsApi.get(latest.id).catch(() => null);
          }
        }

        if (type === 'growth' || type === 'full') {
          const recs = await growthApi.list(babyId).catch(() => []);
          payload.growth = recs || [];
        }

        if (!cancelled) {
          setData(payload);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load report');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [type, babyId]);

  if (loading) {
    return <LoadingSpinner fullScreen label="Preparing report…" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <ErrorState message={error} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <ErrorState message="Nothing to report" />
      </div>
    );
  }

  switch (type) {
    case 'mchat':
      return <MChatReport baby={data.baby} assessment={data.mchat} history={data.mchatHistory} />;
    case 'milestones':
      return <MilestonesReport baby={data.baby} assessment={data.milestones} />;
    case 'symptoms':
      return <SymptomsReport baby={data.baby} assessment={data.symptoms} />;
    case 'growth':
      return <GrowthReport baby={data.baby} records={data.growth} />;
    case 'full':
      return (
        <FullReport
          baby={data.baby}
          mchat={data.mchat}
          mchatHistory={data.mchatHistory}
          milestones={data.milestones}
          symptoms={data.symptoms}
          growth={data.growth}
        />
      );
    default:
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <ErrorState message={`Unknown report type: ${type}`} />
        </div>
      );
  }
}