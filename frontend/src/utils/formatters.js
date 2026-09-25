// src/utils/formatters.js

export function formatDate(iso, opts = {}) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', ...opts,
  });
}

export function formatAge(dob) {
  if (!dob) return '—';
  const birth = new Date(dob);
  const now = new Date();
  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  if (months < 0) return 'Not born yet';
  if (months < 1) {
    const days = Math.floor((now - birth) / (1000 * 60 * 60 * 24));
    return `${days} day${days === 1 ? '' : 's'} old`;
  }
  if (months < 24) return `${months} month${months === 1 ? '' : 's'} old`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? '' : 's'} old`;
}

export function formatWeight(kg, unit = 'kg') {
  if (kg == null) return '—';
  if (unit === 'lbs') return `${(kg * 2.20462).toFixed(1)} lbs`;
  return `${Number(kg).toFixed(1)} kg`;
}

export function formatHeight(cm, unit = 'cm') {
  if (cm == null) return '—';
  if (unit === 'in') return `${(cm / 2.54).toFixed(1)} in`;
  return `${Number(cm).toFixed(1)} cm`;
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function getInitial(name) {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
}