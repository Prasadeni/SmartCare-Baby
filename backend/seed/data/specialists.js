{/* Book Appointment */}
{specialist.echannelingUrl && (
  <div className="flex flex-col gap-2">
    <a
      href={specialist.echannelingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-[0.98] transition-all"
    >
      <span className="material-symbols-outlined text-[18px]">calendar_month</span>
      {specialist.echannelingUrl.includes('/doctor-search/D')
        ? 'Book on eChannelling'
        : 'Find on eChannelling'}
    </a>

    {/* Honest hint for search-fallback doctors */}
    {!specialist.echannelingUrl.includes('/doctor-search/D') && (
      <p className="text-body-sm text-on-surface-variant text-center">
        Direct booking not available — opens a search for this doctor on eChannelling.
      </p>
    )}
  </div>
)}