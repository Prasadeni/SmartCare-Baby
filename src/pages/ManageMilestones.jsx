import React from 'react';
import AdminLayout from '../components/AdminLayout';
import FloatingButtons from '../components/FloatingButtons';

export default function ManageMilestones() {
  return (
    <>
      <AdminLayout activePage="milestones">
        <h2 className="text-headline-lg font-headline-lg text-on-background mb-4">Manage Milestones</h2>
        <p className="text-body-md text-on-surface-variant">Configure milestone questions here.</p>
      </AdminLayout>
      <FloatingButtons />
    </>
  );
}