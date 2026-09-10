import React from 'react';
import AdminLayout from '../components/AdminLayout';
import FloatingButtons from '../components/FloatingButtons';

export default function ManageRisks() {
  return (
    <>
      <AdminLayout activePage="risks">
        <h2 className="text-headline-lg font-headline-lg text-on-background mb-4">Manage Risks</h2>
        <p className="text-body-md text-on-surface-variant">Configure risk threshold levels and red flags here.</p>
      </AdminLayout>
      <FloatingButtons />
    </>
  );
}