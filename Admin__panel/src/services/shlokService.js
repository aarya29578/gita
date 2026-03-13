import { db } from '../firebase'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore'
import { generateHindiFields, numberToHindi } from '../utils/hindiConverter'

export async function listShloks() {
  const snap = await getDocs(collection(db, 'shloks'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Check if a shlok with the same chapter and number already exists
 */
async function checkDuplicateShlok(chapter, shlokNumber, excludeId = null) {
  const q = query(
    collection(db, 'shloks'),
    where('chapter', '==', chapter),
    where('shlokNumber', '==', shlokNumber)
  )
  const snap = await getDocs(q)
  
  // If updating, exclude the current document
  if (excludeId) {
    return snap.docs.some(doc => doc.id !== excludeId)
  }
  
  return !snap.empty
}

export async function addShlok(data) {
  const {
    chapter,
    chapterName,
    shlokNumber,
    keywords,
    star,
    theme,
    speaker,
    summary,
    videoLink,
    sanskrit,
    translation
  } = data

  // Check for duplicates
  const isDuplicate = await checkDuplicateShlok(chapter, shlokNumber)
  if (isDuplicate) {
    throw new Error(`Shlok ${chapter}.${shlokNumber} already exists`)
  }

  // Generate Hindi translations
  const hindiFields = generateHindiFields({
    chapterName,
    theme,
    speaker,
    keywords,
    summary
  })

  // Split keywords into array
  const keywordsArray = keywords?.trim() 
    ? keywords.trim().split(/\s+/).filter(k => k.length > 0)
    : []

  const keywordsHindiArray = hindiFields.keywords_hi?.trim()
    ? hindiFields.keywords_hi.trim().split(/\s+/).filter(k => k.length > 0)
    : keywordsArray // Fallback to English if Hindi not available

  // Structure data for Firestore (matching Flutter app's fromFirestore model)
  const shlokData = {
    chapter: parseInt(chapter),
    number: parseFloat(shlokNumber),
    title: chapterName.trim(),
    summary: summary.trim(),
    speaker: speaker.trim(),
    theme: theme.trim(),
    star: parseInt(star) || 5,
    keywords: keywordsArray,
    sanskrit: sanskrit?.trim() || '',
    translation: translation?.trim() || '',
    posterImageUrl: '', // Can be added later
    
    // Hindi fields
    title_hi: hindiFields.chapterName_hi,
    summary_hi: hindiFields.summary_hi,
    speaker_hi: hindiFields.speaker_hi,
    theme_hi: hindiFields.theme_hi,
    keywords_hi: keywordsHindiArray,
    
    // Metadata
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    videoLink: videoLink?.trim() || ''
  }

  const col = collection(db, 'shloks')
  const docRef = await addDoc(col, shlokData)
  
  return { id: docRef.id, ...shlokData }
}

export async function updateShlok(id, data) {
  const {
    chapter,
    chapterName,
    shlokNumber,
    keywords,
    star,
    theme,
    speaker,
    summary,
    videoLink,
    sanskrit,
    translation
  } = data

  // Check for duplicates (excluding current shlok)
  const isDuplicate = await checkDuplicateShlok(chapter, shlokNumber, id)
  if (isDuplicate) {
    throw new Error(`Shlok ${chapter}.${shlokNumber} already exists`)
  }

  // Generate Hindi translations
  const hindiFields = generateHindiFields({
    chapterName,
    theme,
    speaker,
    keywords,
    summary
  })

  // Split keywords into array
  const keywordsArray = keywords?.trim() 
    ? keywords.trim().split(/\s+/).filter(k => k.length > 0)
    : []

  const keywordsHindiArray = hindiFields.keywords_hi?.trim()
    ? hindiFields.keywords_hi.trim().split(/\s+/).filter(k => k.length > 0)
    : keywordsArray

  const shlokData = {
    chapter: parseInt(chapter),
    number: parseFloat(shlokNumber),
    title: chapterName.trim(),
    summary: summary.trim(),
    speaker: speaker.trim(),
    theme: theme.trim(),
    star: parseInt(star) || 5,
    keywords: keywordsArray,
    sanskrit: sanskrit?.trim() || '',
    translation: translation?.trim() || '',
    
    // Hindi fields
    title_hi: hindiFields.chapterName_hi,
    summary_hi: hindiFields.summary_hi,
    speaker_hi: hindiFields.speaker_hi,
    theme_hi: hindiFields.theme_hi,
    keywords_hi: keywordsHindiArray,
    
    // Metadata
    updatedAt: new Date().toISOString(),
    videoLink: videoLink?.trim() || ''
  }

  await updateDoc(doc(db, 'shloks', id), shlokData)
  return { id, ...shlokData }
}

export async function deleteShlok(id) {
  await deleteDoc(doc(db, 'shloks', id))
}
