/**
 * Hindi Conversion Utilities for VitaGita Admin Panel
 * 
 * Provides translation and conversion functions for English to Hindi/Devanagari
 */

// English digits to Hindi digits mapping
const DIGIT_MAP = {
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
};

// Common speaker names translations
const SPEAKER_TRANSLATIONS = {
  'Dhritrashtr': 'धृतराष्ट्र',
  'Dhritarashtra': 'धृतराष्ट्र',
  'Sanjay': 'संजय',
  'Sanjaya': 'संजय',
  'Duryodhan': 'दुर्योधन',
  'Duryodhana': 'दुर्योधन',
  'Arjun': 'अर्जुन',
  'Arjuna': 'अर्जुन',
  'Krishna': 'कृष्ण',
  'Shri Krishna': 'श्री कृष्ण',
  'Lord Krishna': 'भगवान कृष्ण',
  'Bhagavan': 'भगवान',
  'Bhagwan': 'भगवान'
};

// Common theme translations
const THEME_TRANSLATIONS = {
  'Strategy': 'रणनीति',
  'Duty': 'कर्तव्य',
  'Dharma': 'धर्म',
  'Knowledge': 'ज्ञान',
  'Action': 'कर्म',
  'Devotion': 'भक्ति',
  'Meditation': 'ध्यान',
  'Wisdom': 'बुद्धि',
  'Yoga': 'योग',
  'War': 'युद्ध',
  'Battle': 'युद्ध',
  'Peace': 'शांति',
  'Soul': 'आत्मा',
  'Self': 'स्व',
  'Mind': 'मन',
  'Karma': 'कर्म',
  'Moksha': 'मोक्ष',
  'Liberation': 'मुक्ति'
};

// Common chapter name translations
const CHAPTER_TRANSLATIONS = {
  'Arjun Vishaad Yog': 'अर्जुन विषाद योग',
  'Arjuna Vishada Yoga': 'अर्जुन विषाद योग',
  'Sankhya Yog': 'सांख्य योग',
  'Sankhya Yoga': 'सांख्य योग',
  'Karma Yog': 'कर्म योग',
  'Karma Yoga': 'कर्म योग',
  'Gyan Karma Sanyasa Yog': 'ज्ञान कर्म संन्यास योग',
  'Karma Sanyasa Yoga': 'कर्म संन्यास योग',
  'Karma Vairagya Yog': 'कर्म वैराग्य योग',
  'Atma Samyama Yog': 'आत्म संयम योग',
  'Gyan Vigyan Yog': 'ज्ञान विज्ञान योग',
  'Akshar Brahma Yog': 'अक्षर ब्रह्म योग',
  'Raj Vidya Raj Guhya Yog': 'राज विद्या राज गुह्य योग',
  'Vibhuti Yog': 'विभूति योग',
  'Vishwaroop Darshan Yog': 'विश्वरूप दर्शन योग',
  'Bhakti Yog': 'भक्ति योग',
  'Ksetra Ksetrajna Vibhag Yog': 'क्षेत्र क्षेत्रज्ञ विभाग योग',
  'Gunatraya Vibhag Yog': 'गुणत्रय विभाग योग',
  'Purushottam Yog': 'पुरुषोत्तम योग',
  'Daivasur Sampad Vibhag Yog': 'दैवासुर संपद् विभाग योग',
  'Shraddhatraya Vibhag Yog': 'श्रद्धात्रय विभाग योग',
  'Moksha Sanyasa Yog': 'मोक्ष संन्यास योग'
};

/**
 * Convert English digits to Hindi/Devanagari digits
 * @param {string} text - Text containing English digits
 * @returns {string} Text with Hindi digits
 */
export function convertDigitsToHindi(text) {
  if (!text) return '';
  return String(text).replace(/[0-9]/g, (digit) => DIGIT_MAP[digit] || digit);
}

/**
 * Convert English digits to Hindi in numeric values
 * @param {number|string} num - Number to convert
 * @returns {string} Hindi digit string
 */
export function numberToHindi(num) {
  return convertDigitsToHindi(String(num));
}

/**
 * Translate speaker name to Hindi
 * @param {string} speaker - Speaker name in English
 * @returns {string} Hindi translation or original if not found
 */
export function translateSpeaker(speaker) {
  if (!speaker) return '';
  const trimmed = speaker.trim();
  return SPEAKER_TRANSLATIONS[trimmed] || trimmed;
}

/**
 * Translate theme to Hindi
 * @param {string} theme - Theme in English
 * @returns {string} Hindi translation or original if not found
 */
export function translateTheme(theme) {
  if (!theme) return '';
  const trimmed = theme.trim();
  return THEME_TRANSLATIONS[trimmed] || trimmed;
}

/**
 * Translate chapter name to Hindi
 * @param {string} chapterName - Chapter name in English
 * @returns {string} Hindi translation or original if not found
 */
export function translateChapterName(chapterName) {
  if (!chapterName) return '';
  const trimmed = chapterName.trim();
  return CHAPTER_TRANSLATIONS[trimmed] || trimmed;
}

/**
 * Translate keywords to Hindi (space-separated)
 * @param {string} keywords - Keywords in English (space-separated)
 * @returns {string} Keywords in Hindi or original
 */
export function translateKeywords(keywords) {
  if (!keywords) return '';
  // For now, return as-is since keyword translation requires a large dictionary
  // In production, you'd want to use a translation API or comprehensive dictionary
  return keywords;
}

/**
 * Translate summary/meaning to Hindi
 * @param {string} summary - Summary text in English
 * @returns {string} Hindi translation or original
 */
export function translateSummary(summary) {
  if (!summary) return '';
  // For now, return as-is since full text translation requires translation API
  // In production, integrate with Google Translate API or similar
  return summary;
}

/**
 * Generate complete Hindi fields from English input
 * @param {Object} englishData - Object containing English fields
 * @returns {Object} Object with Hindi field mappings
 */
export function generateHindiFields(englishData) {
  const {
    chapterName = '',
    theme = '',
    speaker = '',
    keywords = '',
    summary = ''
  } = englishData;

  return {
    chapterName_hi: translateChapterName(chapterName),
    theme_hi: translateTheme(theme),
    speaker_hi: translateSpeaker(speaker),
    keywords_hi: translateKeywords(keywords),
    summary_hi: translateSummary(summary)
  };
}

/**
 * Ensure no English text in Hindi fields (validation)
 * @param {string} text - Text to check
 * @returns {boolean} True if contains English characters
 */
export function containsEnglish(text) {
  if (!text) return false;
  return /[a-zA-Z]/.test(text);
}

/**
 * Validate Hindi fields don't contain English text
 * @param {Object} hindiFields - Object with Hindi field values
 * @returns {Array} Array of field names that contain English text
 */
export function validateHindiFields(hindiFields) {
  const errors = [];
  for (const [key, value] of Object.entries(hindiFields)) {
    if (value && containsEnglish(value)) {
      errors.push(key);
    }
  }
  return errors;
}
