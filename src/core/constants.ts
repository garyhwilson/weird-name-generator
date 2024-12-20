export const PHONETICS = {
    consonants: {
      common: {
        b: 8, d: 8, f: 7, g: 7, h: 6, k: 8, l: 9,
        m: 9, n: 9, p: 8, r: 9, s: 9, t: 9, v: 5, w: 6
      },
      rare: {
        c: 3, j: 3, q: 1, x: 1, y: 4, z: 2
      }
    },
    vowels: {
      common: {
        a: 9, e: 9, i: 8, o: 8, u: 6
      },
      diphthongs: {
        ae: 3, ai: 4, au: 3, ea: 4, ee: 4,
        ei: 3, eu: 2, ie: 4, oo: 4, ou: 3
      }
    },
    consonantBlends: {
      initial: {
        bl: 6, br: 7, ch: 7, cl: 6, cr: 7, dr: 7,
        fl: 6, fr: 6, gl: 5, gr: 7, pl: 6, pr: 7,
        sc: 5, sh: 8, sl: 6, sm: 6, sn: 5, sp: 6,
        st: 8, sw: 6, th: 8, tr: 7, tw: 5
      },
      final: {
        ck: 5, ft: 4, ld: 6, lf: 4, lk: 5, ll: 7,
        lt: 6, nd: 7, ng: 7, nk: 6, nt: 7, pt: 4,
        rd: 6, rk: 5, rm: 6, rn: 6, rt: 6, sk: 5,
        st: 7, th: 6
      }
    }
  };
  
  export const STRESS_PATTERNS = {
    1: [
      { pattern: '1', weight: 10 },    // Single stressed syllable
    ],
    2: [
      { pattern: '10', weight: 8 },   // Primary-unstressed
      { pattern: '21', weight: 5 },   // Secondary-primary
    ],
    3: [
      { pattern: '100', weight: 8 },  // Primary-unstressed-unstressed
      { pattern: '201', weight: 6 },  // Secondary-unstressed-primary
      { pattern: '102', weight: 4 },  // Primary-unstressed-secondary
    ],
    4: [
      { pattern: '2010', weight: 8 }, // Secondary-unstressed-primary-unstressed
      { pattern: '1020', weight: 6 }, // Primary-unstressed-secondary-unstressed
      { pattern: '2001', weight: 4 }, // Secondary-unstressed-unstressed-primary
    ],
    5: [
      { pattern: '20100', weight: 8 }, // Secondary-unstressed-primary-unstressed-unstressed
      { pattern: '10200', weight: 6 }, // Primary-unstressed-secondary-unstressed-unstressed
      { pattern: '20010', weight: 4 }, // Secondary-unstressed-unstressed-primary-unstressed
    ]
  };
  
  export const GENDER_CHARACTERISTICS = {
    feminine: {
      vowelPreference: 'diphthongs',
      preferredEndings: {
        a: 9, ia: 8, elle: 7, enne: 6, ette: 6,
        ara: 5, ira: 5, ana: 7
      },
      avoidConsonants: ['k', 'g', 'x'],
      preferredConsonants: ['l', 'n', 'm', 'r'],
      stressPreference: {
        1: '1',
        2: '10',
        3: '100',
        4: '1020'
      }
    },
    masculine: {
      vowelPreference: 'common',
      preferredEndings: {
        us: 8, or: 8, on: 7, ar: 7, ax: 6,
        ir: 6, en: 5
      },
      preferredConsonants: ['k', 'g', 't', 'r', 'th'],
      avoidConsonants: ['w', 'y'],
      stressPreference: {
        1: '1',
        2: '21',
        3: '201',
        4: '2010'
      }
    },
    neutral: {
      vowelPreference: 'mixed',
      preferredEndings: {
        is: 7, en: 7, or: 7, an: 6, el: 6, on: 6
      },
      stressPreference: null
    }
  };

  export const VALIDATION_RULES = {
    disallowedPatterns: [
      /[aeiou]{3,}/i,      // No triple vowels
      /[bcdfghjklmnpqrstvwxyz]{3,}/i,  // No triple consonants
      /(.)\1\1/i,          // No triple letters
      /[q][^u]/i,          // Q must be followed by U
      /[^aeiou]{4,}/i      // Max 3 consonants in a row
    ],
    disallowedEndings: [
      /[bcdfghjklmnpqrstvwxyz]{2,}$/i,  // No ending with multiple consonants (except for specific style endings)
      /[^aeioulnrmkdgx]$/i  // Updated to allow more consonant endings
    ],
    singleSyllableRules: {
      minLength: 2,        // Minimum length for single syllable
      maxLength: 5,        // Maximum length for single syllable
      preferredPatterns: [
        /^[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz]$/i,  // CVC
        /^[bcdfghjklmnpqrstvwxyz][aeiou][rlmn]$/i,  // CVR (ending in liquid or nasal)
        /^[bcdfghjklmnpqrstvwxyz][aeiou]$/i  // CV
      ]
    }
  };
  
  export const BASIC_STYLE_PATTERNS = {
    simple: {
      minSyllables: 1,
      maxSyllables: 3,
      preferredPatterns: [
        { pattern: 'CV', weight: 10 },
        { pattern: 'CVC', weight: 8 },
        { pattern: 'VC', weight: 5 }
      ],
      endings: {
        a: 8, e: 8, i: 6, o: 6, y: 5,
        // Added more single-syllable appropriate endings
        n: 6, m: 6, r: 6, l: 6
      }
    },
    elven: {
      minSyllables: 2,
      maxSyllables: 4,
      preferredPatterns: [
        { pattern: 'CVV', weight: 9 },
        { pattern: 'CVC', weight: 6 },
        { pattern: 'VCV', weight: 7 }
      ],
      endings: {
        iel: 9, ion: 8, ith: 7, el: 6, il: 6,
        ael: 8, aer: 7, ali: 6
      }
    },
    dwarf: {
      minSyllables: 1, // Changed from 2 to 1
      maxSyllables: 3,
      preferredPatterns: [
        { pattern: 'CVC', weight: 10 },
        { pattern: 'CCVC', weight: 7 },
        { pattern: 'CVr', weight: 8 }
      ],
      endings: {
        in: 8, ur: 8, or: 7, ak: 7, uk: 6,
        grim: 6, din: 7, gar: 7,
        // Added single-syllable appropriate endings
        k: 6, r: 6, m: 6, d: 6, g: 6, x: 4
      }
    },
    mythical: {
      minSyllables: 3,
      maxSyllables: 5,
      preferredPatterns: [
        { pattern: 'CVV', weight: 8 },
        { pattern: 'CVC', weight: 7 },
        { pattern: 'CCVV', weight: 6 }
      ],
      endings: {
        ax: 7, ox: 7, ix: 6, or: 8, us: 8,
        um: 7, on: 7, yr: 6
      }
    }
  };
  
  export const ADDITIONAL_STYLE_PATTERNS = {
    draconic: {
      minSyllables: 2,
      maxSyllables: 4,
      preferredPatterns: [
        { pattern: 'CVx', weight: 9 },   // Emphasis on X endings
        { pattern: 'CVC', weight: 7 },
        { pattern: 'CVz', weight: 8 }    // Z sounds
      ],
      endings: {
        ax: 9, ox: 8, ex: 7, ix: 7,     // X endings
        zar: 8, zir: 7, zor: 7,         // Z endings
        thor: 6, dor: 6, gor: 6         // Strong endings
      }
    },
    fae: {
      minSyllables: 2,
      maxSyllables: 3,
      preferredPatterns: [
        { pattern: 'VCV', weight: 9 },    // Flowing vowel patterns
        { pattern: 'CVV', weight: 8 },    // Emphasis on diphthongs
        { pattern: 'VC', weight: 6 }      // Short, airy sounds
      ],
      endings: {
        ae: 9, ai: 8, ie: 8, yi: 7,
        wyn: 7, lin: 6, lis: 6, ria: 7
      }
    },
    orcish: {
      minSyllables: 1,
      maxSyllables: 3,
      preferredPatterns: [
        { pattern: 'CCVC', weight: 9 },   // Harsh consonant clusters
        { pattern: 'CVC', weight: 7 },
        { pattern: 'GrV', weight: 8 }     // Gr- sounds
      ],
      endings: {
        gul: 8, dug: 8, rog: 7, kag: 7,
        dar: 6, mar: 6, kar: 6, nak: 7
      }
    },
    celestial: {
      minSyllables: 3,
      maxSyllables: 5,
      preferredPatterns: [
        { pattern: 'CVV', weight: 9 },    // Ethereal sounds
        { pattern: 'VCV', weight: 8 },
        { pattern: 'CVC', weight: 6 }
      ],
      endings: {
        ael: 9, iel: 8, ias: 8, ius: 7,
        anor: 7, eros: 6, aras: 6, elis: 7
      }
    },
    coastal: {
      minSyllables: 2,
      maxSyllables: 4,
      preferredPatterns: [
        { pattern: 'CVV', weight: 8 },    // Flowing water sounds
        { pattern: 'VrV', weight: 7 },    // Rolling R sounds
        { pattern: 'CVl', weight: 7 }     // Liquid L endings
      ],
      endings: {
        sea: 8, wave: 7, tide: 7, mere: 6,
        cove: 6, bay: 6, isle: 7, haven: 5
      }
    },
    desert: {
      minSyllables: 2,
      maxSyllables: 4,
      preferredPatterns: [
        { pattern: 'CVh', weight: 8 },    // Breathy H sounds
        { pattern: 'VCV', weight: 7 },
        { pattern: 'CVC', weight: 6 }
      ],
      endings: {
        ah: 8, ir: 7, ad: 7, im: 6,
        rah: 7, san: 6, kar: 6, dun: 5
      }
    },
    nordic: {
      minSyllables: 1,
      maxSyllables: 3,
      preferredPatterns: [
        { pattern: 'CVC', weight: 9 },
        { pattern: 'CVCd', weight: 7 },   // -d endings
        { pattern: 'ThV', weight: 7 }     // Th- beginnings
      ],
      endings: {
        gar: 8, mund: 8, ald: 7, ulf: 7,
        thor: 8, vald: 7, bjorn: 6, grim: 6
      }
    },
    sylvan: {
      minSyllables: 2,
      maxSyllables: 4,
      preferredPatterns: [
        { pattern: 'CVl', weight: 9 },    // Nature-like L sounds
        { pattern: 'VCV', weight: 8 },
        { pattern: 'CVn', weight: 7 }     // Soft N endings
      ],
      endings: {
        leaf: 8, wood: 7, vine: 7, thorn: 6,
        bloom: 6, root: 6, branch: 5, grove: 5
      }
    }
  };

  export const STYLE_PATTERNS = {
    ...BASIC_STYLE_PATTERNS,
    ...ADDITIONAL_STYLE_PATTERNS
  };
  