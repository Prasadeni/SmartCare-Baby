// Developmental Milestones (CDC/AAP based)
// Areas match the 7 tabs in the UI
// expected_age_months = when a typically-developing child should achieve it

module.exports = [
  // ========== GROSS MOTOR ==========
  { id: "gm_01", area: "Gross Motor", description: "Lifts head briefly when on tummy",    expected_age_months: 2,  is_critical: false },
  { id: "gm_02", area: "Gross Motor", description: "Holds head steady without support",   expected_age_months: 4,  is_critical: false },
  { id: "gm_03", area: "Gross Motor", description: "Rolls over from tummy to back",       expected_age_months: 6,  is_critical: false },
  { id: "gm_04", area: "Gross Motor", description: "Sits without support",                expected_age_months: 9,  is_critical: true  },
  { id: "gm_05", area: "Gross Motor", description: "Pulls to stand",                      expected_age_months: 9,  is_critical: false },
  { id: "gm_06", area: "Gross Motor", description: "Crawls on hands and knees",           expected_age_months: 10, is_critical: false },
  { id: "gm_07", area: "Gross Motor", description: "Stands with support",                 expected_age_months: 12, is_critical: false },
  { id: "gm_08", area: "Gross Motor", description: "Walks independently",                 expected_age_months: 15, is_critical: true  },
  { id: "gm_09", area: "Gross Motor", description: "Runs",                                expected_age_months: 24, is_critical: false },
  { id: "gm_10", area: "Gross Motor", description: "Kicks a ball",                        expected_age_months: 24, is_critical: false },

  // ========== FINE MOTOR ==========
  { id: "fm_01", area: "Fine Motor", description: "Opens hands briefly",                    expected_age_months: 3,  is_critical: false },
  { id: "fm_02", area: "Fine Motor", description: "Brings hands to mouth",                  expected_age_months: 4,  is_critical: false },
  { id: "fm_03", area: "Fine Motor", description: "Reaches for and grasps toys",            expected_age_months: 6,  is_critical: false },
  { id: "fm_04", area: "Fine Motor", description: "Passes objects from one hand to other",  expected_age_months: 8,  is_critical: false },
  { id: "fm_05", area: "Fine Motor", description: "Uses pincer grasp (thumb and index)",    expected_age_months: 10, is_critical: true  },
  { id: "fm_06", area: "Fine Motor", description: "Bangs two objects together",             expected_age_months: 12, is_critical: false },
  { id: "fm_07", area: "Fine Motor", description: "Puts objects into a container",          expected_age_months: 15, is_critical: false },
  { id: "fm_08", area: "Fine Motor", description: "Scribbles with a crayon",                expected_age_months: 18, is_critical: false },
  { id: "fm_09", area: "Fine Motor", description: "Stacks 3 or more blocks",                expected_age_months: 24, is_critical: false },
  { id: "fm_10", area: "Fine Motor", description: "Turns pages of a book",                  expected_age_months: 24, is_critical: false },

  // ========== LANGUAGE ==========
  { id: "lg_01", area: "Language", description: "Makes cooing sounds",                        expected_age_months: 2,  is_critical: false },
  { id: "lg_02", area: "Language", description: "Babbles with consonants (ba, da, ma)",       expected_age_months: 6,  is_critical: false },
  { id: "lg_03", area: "Language", description: "Responds to own name",                       expected_age_months: 9,  is_critical: true  },
  { id: "lg_04", area: "Language", description: "Uses gestures like waving or pointing",      expected_age_months: 12, is_critical: false },
  { id: "lg_05", area: "Language", description: "Says first word (other than mama/dada)",     expected_age_months: 12, is_critical: true  },
  { id: "lg_06", area: "Language", description: "Follows simple one-step instructions",       expected_age_months: 15, is_critical: false },
  { id: "lg_07", area: "Language", description: "Says 3 or more words",                       expected_age_months: 15, is_critical: false },
  { id: "lg_08", area: "Language", description: "Points to at least one body part",           expected_age_months: 18, is_critical: false },
  { id: "lg_09", area: "Language", description: "Says 10 or more words",                      expected_age_months: 18, is_critical: true  },
  { id: "lg_10", area: "Language", description: "Uses two-word phrases (e.g., 'more milk')",  expected_age_months: 24, is_critical: true  },

  // ========== COGNITIVE ==========
  { id: "cg_01", area: "Cognitive", description: "Watches faces intently",                       expected_age_months: 2,  is_critical: false },
  { id: "cg_02", area: "Cognitive", description: "Looks for dropped object",                     expected_age_months: 6,  is_critical: false },
  { id: "cg_03", area: "Cognitive", description: "Finds hidden object (object permanence)",      expected_age_months: 9,  is_critical: false },
  { id: "cg_04", area: "Cognitive", description: "Explores objects by shaking, banging, throwing", expected_age_months: 12, is_critical: false },
  { id: "cg_05", area: "Cognitive", description: "Imitates simple actions",                      expected_age_months: 15, is_critical: false },
  { id: "cg_06", area: "Cognitive", description: "Shows interest in a toy or book",             expected_age_months: 18, is_critical: false },
  { id: "cg_07", area: "Cognitive", description: "Pretend play (feeding a doll, etc.)",         expected_age_months: 24, is_critical: false },

  // ========== SOCIAL ==========
  { id: "sc_01", area: "Social", description: "Smiles responsively",                              expected_age_months: 3,  is_critical: false },
  { id: "sc_02", area: "Social", description: "Laughs out loud",                                  expected_age_months: 6,  is_critical: false },
  { id: "sc_03", area: "Social", description: "Shows stranger anxiety",                           expected_age_months: 9,  is_critical: false },
  { id: "sc_04", area: "Social", description: "Plays peek-a-boo or pat-a-cake",                   expected_age_months: 12, is_critical: false },
  { id: "sc_05", area: "Social", description: "Shows affection to familiar people",               expected_age_months: 15, is_critical: false },
  { id: "sc_06", area: "Social", description: "Plays alongside other children",                   expected_age_months: 24, is_critical: false },

  // ========== SELF-HELP ==========
  { id: "sh_01", area: "Self-Help", description: "Brings hands to mouth to feed",                 expected_age_months: 6,  is_critical: false },
  { id: "sh_02", area: "Self-Help", description: "Holds own bottle or sippy cup",                expected_age_months: 12, is_critical: false },
  { id: "sh_03", area: "Self-Help", description: "Feeds self with fingers",                      expected_age_months: 15, is_critical: false },
  { id: "sh_04", area: "Self-Help", description: "Takes off simple clothing (socks, hat)",       expected_age_months: 18, is_critical: false },
  { id: "sh_05", area: "Self-Help", description: "Uses spoon with some spilling",                expected_age_months: 24, is_critical: false },

  // ========== HEARING / VISION ==========
  { id: "hv_01", area: "Hearing/Vision", description: "Turns head toward sound",                    expected_age_months: 4,  is_critical: false },
  { id: "hv_02", area: "Hearing/Vision", description: "Tracks moving objects with eyes",            expected_age_months: 4,  is_critical: false },
  { id: "hv_03", area: "Hearing/Vision", description: "Responds to familiar voices",                expected_age_months: 6,  is_critical: false },
  { id: "hv_04", area: "Hearing/Vision", description: "Looks at named objects when pointed to",     expected_age_months: 12, is_critical: false },
  { id: "hv_05", area: "Hearing/Vision", description: "Says 3 or more words (linked to hearing)",   expected_age_months: 15, is_critical: false }
];