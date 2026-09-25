// backend/seed/data/emergency-contacts.js
export const emergencyContacts = [
  { name: 'Suwa Seriya Ambulance', category: 'Ambulance', phone: '1990', alternatePhone: '', address: '', city: '', description: 'Free pre-hospital emergency ambulance service', isNational: true, isActive: true, sortOrder: 1 },
  { name: 'Police Emergency', category: 'Police', phone: '119', alternatePhone: '', address: '', city: '', description: 'National police emergency line', isNational: true, isActive: true, sortOrder: 2 },
  { name: 'Fire & Rescue', category: 'Fire', phone: '110', alternatePhone: '', address: '', city: '', description: 'Fire and rescue services', isNational: true, isActive: true, sortOrder: 3 },
  { name: 'National Hospital Colombo', category: 'Hospital', phone: '+94 11 269 1111', city: 'Colombo', description: 'Major government hospital emergency department', isNational: false, isActive: true, sortOrder: 10 },
  { name: 'Lady Ridgeway Hospital', category: 'Hospital', phone: '+94 11 269 4861', city: 'Colombo', description: 'Primary pediatric hospital', isNational: false, isActive: true, sortOrder: 11 },
  { name: 'Poison Information Centre', category: 'Poison Control', phone: '+94 11 268 6144', city: 'Colombo', description: '24/7 poisoning advice', isNational: true, isActive: true, sortOrder: 4 },
  { name: 'Kandy General Hospital', category: 'Hospital', phone: '+94 81 222 2261', city: 'Kandy', description: 'Central province emergency department', isNational: false, isActive: true, sortOrder: 20 },
  { name: 'Karapitiya Teaching Hospital', category: 'Hospital', phone: '+94 91 223 2251', city: 'Galle', description: 'Southern province emergency department', isNational: false, isActive: true, sortOrder: 21 },
];