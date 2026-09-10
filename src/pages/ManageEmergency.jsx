import React from 'react';
import AdminLayout from '../components/AdminLayout';
import FloatingButtons from '../components/FloatingButtons';

export default function ManageEmergency() {
  return (
    <>
      <AdminLayout activePage="emergency">
        <h2 className="text-headline-lg font-headline-lg text-on-background mb-4">Manage Emergency</h2>
        <p className="text-body-md text-on-surface-variant mb-8">Add, edit, or delete emergency contacts and hotlines.</p>
        
        <div className="bg-surface-container-lowest rounded-xl p-8 soft-shadow border border-outline-variant/10 text-center text-on-surface-variant">
           <span className="material-symbols-outlined text-5xl text-error mb-4">emergency</span>
           <p className="font-headline-md text-headline-md">Emergency Contacts</p>
           <p>Ready to connect to backend.</p>
        </div>
      </AdminLayout>
      <FloatingButtons />
    </>
  );
}