import React from 'react';
import AdminLayout from '../components/AdminLayout';
import FloatingButtons from '../components/FloatingButtons';

export default function ManageEducation() {
  return (
    <>
      <AdminLayout activePage="education">
        <h2 className="text-headline-lg font-headline-lg text-on-background mb-4">Manage Education</h2>
        <p className="text-body-md text-on-surface-variant mb-8">Add, edit, or delete educational articles and resources.</p>
        
        <div className="bg-surface-container-lowest rounded-xl p-8 soft-shadow border border-outline-variant/10 text-center text-on-surface-variant">
           <span className="material-symbols-outlined text-5xl text-primary mb-4">menu_book</span>
           <p className="font-headline-md text-headline-md">Education Content</p>
           <p>Ready to connect to backend.</p>
        </div>
      </AdminLayout>
      <FloatingButtons />
    </>
  );
}