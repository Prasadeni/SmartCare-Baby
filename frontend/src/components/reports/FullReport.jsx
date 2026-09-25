// src/components/reports/FullReport.jsx
import React from 'react';
import MChatReport from './MChatReport';
import MilestonesReport from './MilestonesReport';
import SymptomsReport from './SymptomsReport';
import GrowthReport from './GrowthReport';

export default function FullReport({ baby, mchat, mchatHistory, milestones, symptoms, growth }) {
  return (
    <>
      <MChatReport baby={baby} assessment={mchat} history={mchatHistory} />
      <div className="page-break" />
      <MilestonesReport baby={baby} assessment={milestones} />
      <div className="page-break" />
      <SymptomsReport baby={baby} assessment={symptoms} />
      <div className="page-break" />
      <GrowthReport baby={baby} records={growth} />
    </>
  );
}