// src/data/pregnancyWeeks.js
// Reference data for each week of pregnancy.
// Sources: WHO antenatal care guidelines, AAP, ACOG, NHS.
// Images: LoremFlickr (topical, free, no API key). Falls back to emoji.

export const TRIMESTERS = [
  { label: '1st Trimester', startWeek: 1,  endWeek: 13 },
  { label: '2nd Trimester', startWeek: 14, endWeek: 27 },
  { label: '3rd Trimester', startWeek: 28, endWeek: 40 },
];

// Truncate word at 90 chars for the compact tile label
export const pregnancyWeeks = {
  4:  { size: 'Poppy Seed',      emoji: '🌱', lengthCm: 0.1,  weightG: 0.04, imageTag: 'poppy-seed',  description: 'Implantation is complete. The embryo is smaller than a grain of rice — the neural tube (future brain and spinal cord) is forming.', tip: 'Start taking 400 mcg of folic acid daily if you haven\'t already. It reduces the risk of neural tube defects.' },
  5:  { size: 'Sesame Seed',     emoji: '🌰', lengthCm: 0.2,  weightG: 0.1,  imageTag: 'sesame-seed', description: 'The heart begins to form and pump. Major organs — including kidneys and liver — are starting to develop.', tip: 'Avoid alcohol, raw fish, and unpasteurized dairy. Book your first antenatal visit.' },
  6:  { size: 'Lentil',          emoji: '🫘', lengthCm: 0.6,  weightG: 0.4,  imageTag: 'lentil',      description: 'Facial features begin to take shape. Small buds will become arms and legs in the coming weeks.', tip: 'Morning sickness often peaks now. Eat small, frequent meals and stay hydrated.' },
  7:  { size: 'Blueberry',       emoji: '🫐', lengthCm: 1.3,  weightG: 1,    imageTag: 'blueberry',   description: 'The brain is growing rapidly — about 100 new cells per minute. The umbilical cord is fully formed.', tip: 'Take it easy. Fatigue is normal. Listen to your body and rest when you can.' },
  8:  { size: 'Raspberry',       emoji: '🫐', lengthCm: 1.6,  weightG: 1,    imageTag: 'raspberry',   description: 'Fingers and toes are beginning to form. The heart is beating at about 160 beats per minute.', tip: 'Consider a first-trimester screening test around week 11–13.' },
  9:  { size: 'Grape',           emoji: '🍇', lengthCm: 2.3,  weightG: 2,    imageTag: 'green-grape', description: 'All essential organs have begun to form. The embryo is now officially a fetus.', tip: 'Eat iron-rich foods like spinach and lentils. Your blood volume is increasing.' },
  10: { size: 'Strawberry',      emoji: '🍓', lengthCm: 3.1,  weightG: 4,    imageTag: 'strawberry',  description: 'The fetus can bend its limbs. Tiny nails are forming on the fingers and toes.', tip: 'Book a dating scan if you haven\'t had one yet.' },
  11: { size: 'Lime',            emoji: '🍋', lengthCm: 4.1,  weightG: 7,    imageTag: 'lime',        description: 'The fetus is moving, though you won\'t feel it yet. Tooth buds are forming under the gums.', tip: 'Start doing pelvic floor exercises — they help with delivery and recovery.' },
  12: { size: 'Plum',            emoji: '🍑', lengthCm: 5.4,  weightG: 14,   imageTag: 'plum',        description: 'Reflexes are developing. The fetus can open and close its fingers and curl its toes.', tip: 'The risk of miscarriage drops significantly after this week.' },
  13: { size: 'Lemon',           emoji: '🍋', lengthCm: 7.4,  weightG: 23,   imageTag: 'lemon',       description: 'Vocal cords are forming. Fingerprints are now unique to your baby.', tip: 'Welcome to the second trimester — energy often returns now.' },
  14: { size: 'Peach',           emoji: '🍑', lengthCm: 8.7,  weightG: 43,   imageTag: 'peach',       description: 'The fetus can squint, frown, and grimace. Lanugo (fine hair) is starting to grow.', tip: 'Mild exercise like walking or prenatal yoga is safe and beneficial now.' },
  15: { size: 'Apple',           emoji: '🍎', lengthCm: 10.1, weightG: 70,   imageTag: 'red-apple',   description: 'Bones are hardening. The fetus can sense light through closed eyelids.', tip: 'Sleep on your side rather than your back to support circulation.' },
  16: { size: 'Avocado',         emoji: '🥑', lengthCm: 11.6, weightG: 100,  imageTag: 'avocado',     description: 'The fetus can hear your voice. Its circulatory system is now fully functional.', tip: 'Talk, read, or sing to your bump — your baby can hear you now.' },
  17: { size: 'Pear',            emoji: '🍐', lengthCm: 13.0, weightG: 140,  imageTag: 'pear',        description: 'Fat is beginning to form under the skin, helping regulate body temperature.', tip: 'You may start feeling the first flutters — called "quickening."' },
  18: { size: 'Bell Pepper',     emoji: '🫑', lengthCm: 14.2, weightG: 190,  imageTag: 'bell-pepper', description: 'The fetus is yawning and hiccupping. You might feel the hiccups as little rhythmic taps.', tip: 'Schedule your anatomy scan around week 18–22.' },
  19: { size: 'Mango',           emoji: '🥭', lengthCm: 15.3, weightG: 240,  imageTag: 'mango',       description: 'Vernix caseosa — a protective white coating — is forming over the skin.', tip: 'Watch for leg cramps. Stretch before bed and stay hydrated.' },
  20: { size: 'Banana',          emoji: '🍌', lengthCm: 16.4, weightG: 300,  imageTag: 'banana',      description: 'You\'re halfway there! The fetus is swallowing amniotic fluid and practicing digestion.', tip: 'This is a common time for the anatomy scan. Ask your doctor about it.' },
  21: { size: 'Carrot',          emoji: '🥕', lengthCm: 26.7, weightG: 360,  imageTag: 'carrot',      description: 'Measurements now go from head to heel. The fetus is moving more purposefully.', tip: 'Your baby can now taste what you eat — flavors pass into the amniotic fluid.' },
  22: { size: 'Papaya',          emoji: '🥭', lengthCm: 27.8, weightG: 430,  imageTag: 'papaya',      description: 'The fetus is starting to look like a newborn. Lips, eyelids, and eyebrows are more distinct.', tip: 'Talk to your doctor about the Tdap vaccine (usually given 27–36 weeks).' },
  23: { size: 'Grapefruit',      emoji: '🍊', lengthCm: 28.9, weightG: 501,  imageTag: 'grapefruit',  description: 'The fetus can hear familiar sounds and voices from outside the womb.', tip: 'Watch for signs of preterm labor — call your doctor if you notice them.' },
  24: { size: 'Cantaloupe',      emoji: '🍈', lengthCm: 30.0, weightG: 600,  imageTag: 'cantaloupe',  description: 'Taste buds are fully formed. Lungs are developing branches of the respiratory tree. Your baby may be practicing breathing movements.', tip: 'At week 24, iron is crucial for your baby\'s developing blood supply. Try incorporating more spinach, lentils, or fortified cereals into your meals.' },
  25: { size: 'Rutabaga',        emoji: '🥔', lengthCm: 34.6, weightG: 660,  imageTag: 'rutabaga',    description: 'The fetus is gaining baby fat. Its skin is becoming smoother.', tip: 'Start thinking about a birth plan. Ask your provider what to prepare.' },
  26: { size: 'Scallion',        emoji: '🧅', lengthCm: 35.6, weightG: 760,  imageTag: 'scallion',    description: 'The fetus can open its eyes for the first time. It responds to light and sound.', tip: 'Monitor fetal movements daily. Ten distinct movements in two hours is a good sign.' },
  27: { size: 'Cauliflower',     emoji: '🥦', lengthCm: 36.6, weightG: 875,  imageTag: 'cauliflower', description: 'The fetus now has regular sleep and wake cycles — just like a newborn.', tip: 'Welcome to the third trimester. Antenatal visits will become more frequent.' },
  28: { size: 'Eggplant',        emoji: '🍆', lengthCm: 37.6, weightG: 1005, imageTag: 'eggplant',    description: 'The fetus can blink and dream. Brain waves now show REM sleep patterns.', tip: 'Watch for swelling in hands and feet — mention it to your doctor if sudden.' },
  29: { size: 'Butternut Squash',emoji: '🎃', lengthCm: 38.6, weightG: 1153, imageTag: 'butternut-squash', description: 'Muscles and lungs are maturing. The fetus is gaining weight rapidly now.', tip: 'Sleep on your side. Try a pregnancy pillow for support.' },
  30: { size: 'Cucumber',        emoji: '🥒', lengthCm: 39.9, weightG: 1319, imageTag: 'cucumber',    description: 'The brain is developing grooves and wrinkles. The fetus can regulate its own temperature.', tip: 'Braxton Hicks contractions may start. They\'re irregular and painless — not labor.' },
  31: { size: 'Coconut',         emoji: '🥥', lengthCm: 41.1, weightG: 1502, imageTag: 'coconut',     description: 'The fetus can turn its head. It\'s processing information from all five senses.', tip: 'Keep up your calcium and vitamin D intake — your baby\'s bones are hardening.' },
  32: { size: 'Jicama',          emoji: '🥔', lengthCm: 42.4, weightG: 1702, imageTag: 'jicama',      description: 'The fetus is practicing breathing and sucking. Most babies settle into a head-down position around now.', tip: 'Talk to your doctor about group B strep screening at 35–37 weeks.' },
  33: { size: 'Pineapple',       emoji: '🍍', lengthCm: 43.7, weightG: 1918, imageTag: 'pineapple',   description: 'The skull remains soft and flexible — that\'s important for birth.', tip: 'Consider packing a hospital bag. Check what your hospital provides.' },
  34: { size: 'Cantaloupe',      emoji: '🍈', lengthCm: 45.0, weightG: 2146, imageTag: 'cantaloupe',  description: 'The central nervous system is maturing. Lungs are nearly fully developed.', tip: 'Watch for signs of preterm labor — call your doctor if you notice them.' },
  35: { size: 'Honeydew Melon',  emoji: '🍈', lengthCm: 46.2, weightG: 2383, imageTag: 'honeydew',    description: 'The fetus is gaining about 30 g per day. Most babies turn head-down by now.', tip: 'Learn the difference between real contractions and Braxton Hicks.' },
  36: { size: 'Romaine Lettuce', emoji: '🥬', lengthCm: 47.4, weightG: 2622, imageTag: 'romaine-lettuce', description: 'The fetus is likely dropping lower into the pelvis. This is called "lightening."', tip: 'Weekly antenatal visits usually start now. Get plenty of rest.' },
  37: { size: 'Swiss Chard',     emoji: '🥬', lengthCm: 48.6, weightG: 2859, imageTag: 'swiss-chard',  description: 'The fetus is officially "early term." It can grasp firmly and has a strong suck reflex.', tip: 'Watch for the signs of labor: regular contractions, water breaking, or a "bloody show."' },
  38: { size: 'Leek',            emoji: '🧅', lengthCm: 49.8, weightG: 3083, imageTag: 'leek',        description: 'The fetus is "full term." Its grasp is strong and its organs are ready for life outside.', tip: 'Stay close to home. Labor can start any time now.' },
  39: { size: 'Small Pumpkin',   emoji: '🎃', lengthCm: 50.7, weightG: 3288, imageTag: 'pumpkin',     description: 'The fetus continues to build fat, especially around the cheeks — helpful for breastfeeding.', tip: 'Rest, hydrate, and keep your phone charged.' },
  40: { size: 'Pumpkin',         emoji: '🎃', lengthCm: 51.2, weightG: 3462, imageTag: 'pumpkin',     description: 'Your baby is ready to meet you. Any day now.', tip: 'If you pass your due date, your provider will discuss options for monitoring.' },
};

export function getWeekData(week) {
  if (!week || week < 4) return pregnancyWeeks[4];
  if (week > 40) return pregnancyWeeks[40];
  return pregnancyWeeks[Math.floor(week)] || pregnancyWeeks[40];
}

export function getTrimester(week) {
  if (week <= 13) return 1;
  if (week <= 27) return 2;
  return 3;
}

export function getProgressPercent(week) {
  return Math.min(100, Math.max(0, ((week - 1) / 39) * 100));
}

export function getDaysToGo(week) {
  const totalDays = 280; // 40 weeks from LMP
  return Math.max(0, totalDays - week * 7);
}

// LoremFlickr URL — free, no API key, topical
export function getWeekImageUrl(imageTag) {
  return `https://loremflickr.com/400/400/${imageTag}`;
}