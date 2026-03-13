/**
 * Export Firestore Shloks to JSON Format
 * 
 * This utility helps export shloks from Firestore to the JSON format
 * used by the Flutter app (shlok_data.json and shlok_data_hindi.json)
 */

import { getDocs, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { numberToHindi } from './hindiConverter'

/**
 * Convert Firestore shlok to JSON format matching shlok_data.json structure
 */
function convertToJSONFormat(shlok, includeHindiSummary = false) {
  const entry = {
    "": "",
    "__1": shlok.chapter,
    "__2": shlok.title,
    "__3": shlok.number,
    "__4": Array.isArray(shlok.keywords) ? shlok.keywords.join(' ') : shlok.keywords,
    "__5": shlok.star,
    "__6": shlok.theme,
    "__7": shlok.speaker,
    "__8": shlok.summary,
    "__9": shlok.videoLink || '',
    "__2_hi": shlok.title_hi || shlok.title,
    "__7_hi": shlok.speaker_hi || shlok.speaker,
    "__6_hi": shlok.theme_hi || shlok.theme,
    "__4_hi": Array.isArray(shlok.keywords_hi) 
      ? shlok.keywords_hi.join(' ') 
      : (shlok.keywords_hi || (Array.isArray(shlok.keywords) ? shlok.keywords.join(' ') : shlok.keywords))
  }

  // Add Hindi summary only for hindi JSON
  if (includeHindiSummary) {
    entry["__8_hi"] = shlok.summary_hi || shlok.summary
  }

  return entry
}

/**
 * Export all shloks from Firestore to JSON format
 */
export async function exportShloksToJSON(includeHindiSummary = false) {
  try {
    const snap = await getDocs(collection(db, 'shloks'))
    const shloks = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Sort by chapter and shlok number
    shloks.sort((a, b) => {
      if (a.chapter !== b.chapter) return a.chapter - b.chapter
      return a.number - b.number
    })

    // Create header entry
    const header = {
      "": "",
      "__1": "Chapter #",
      "__2": "Chapter Name",
      "__3": "Shlok #",
      "__4": "Keywords",
      "__5": "Star",
      "__6": "Theme",
      "__7": "Speaker",
      "__8": "Shlok Summary",
      "__9": "AV Link"
    }

    // Convert all shloks
    const jsonData = [header, ...shloks.map(s => convertToJSONFormat(s, includeHindiSummary))]

    return jsonData
  } catch (error) {
    console.error('Error exporting shloks:', error)
    throw error
  }
}

/**
 * Download JSON file
 */
export function downloadJSON(data, filename) {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export English shloks JSON
 */
export async function exportEnglishJSON() {
  const data = await exportShloksToJSON(false)
  downloadJSON(data, 'shlok_data.json')
}

/**
 * Export Hindi shloks JSON
 */
export async function exportHindiJSON() {
  const data = await exportShloksToJSON(true)
  downloadJSON(data, 'shlok_data_hindi.json')
}

/**
 * Export both English and Hindi JSON files
 */
export async function exportBothJSON() {
  await exportEnglishJSON()
  // Wait a bit before downloading the second file
  await new Promise(resolve => setTimeout(resolve, 500))
  await exportHindiJSON()
}
