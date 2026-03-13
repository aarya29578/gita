import React, { useEffect, useMemo, useState } from 'react'
import DataTable from '../components/DataTable'
import FilterBar from '../components/FilterBar'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { listShloks, addShlok, updateShlok, deleteShlok } from '../services/shlokService'
import { exportBothJSON } from '../utils/exportShloks'

export default function Shloks() {
  const [rows, setRows] = useState([])
  const [selectedThemes, setSelectedThemes] = useState([])
  const [selectedChapters, setSelectedChapters] = useState([])
  const [editOpen, setEditOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [current, setCurrent] = useState(null)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState('')
  const [exporting, setExporting] = useState(false)
  
  const empty = {
    id: '',
    chapter: '',
    chapterName: '',
    shlokNumber: '',
    keywords: '',
    star: 5,
    theme: '',
    speaker: '',
    summary: '',
    videoLink: '',
    sanskrit: '',
    translation: ''
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'chapter', label: 'Ch' },
    { key: 'shlokNumber', label: 'Shlok #' },
    { key: 'chapterName', label: 'Chapter Name' },
    { key: 'theme', label: 'Theme' },
    { key: 'speaker', label: 'Speaker' },
    { key: 'star', label: 'Star' },
  ]

  async function refresh() {
    const list = await listShloks()
    // Map Firestore fields to form fields
    const mapped = list.map(item => ({
      id: item.id,
      chapter: item.chapter,
      chapterName: item.title || item.chapterName || '',
      shlokNumber: item.number || item.shlokNumber || '',
      keywords: Array.isArray(item.keywords) ? item.keywords.join(' ') : (item.keywords || ''),
      star: item.star || 5,
      theme: item.theme || '',
      speaker: item.speaker || '',
      summary: item.summary || '',
      videoLink: item.videoLink || '',
      sanskrit: item.sanskrit || '',
      translation: item.translation || ''
    }))
    setRows(mapped)
  }

  useEffect(() => { refresh() }, [])

  function openNew() {
    setCurrent({ ...empty })
    setEditOpen(true)
  }

  function openEdit(row) {
    setCurrent({ ...row })
    setEditOpen(true)
  }

  async function save() {
    // Validate required fields
    const newErrors = {}
    if (!current.chapter || current.chapter < 1 || current.chapter > 18) {
      newErrors.chapter = 'Chapter must be between 1-18'
    }
    if (!current.chapterName?.trim()) {
      newErrors.chapterName = 'Chapter name is required'
    }
    if (!current.shlokNumber || current.shlokNumber < 1) {
      newErrors.shlokNumber = 'Shlok number is required'
    }
    if (!current.theme?.trim()) {
      newErrors.theme = 'Theme is required'
    }
    if (!current.speaker?.trim()) {
      newErrors.speaker = 'Speaker is required'
    }
    if (!current.summary?.trim()) {
      newErrors.summary = 'Summary is required'
    }
    if (current.star < 1 || current.star > 5) {
      newErrors.star = 'Star rating must be between 1-5'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setToast('Please fix validation errors')
      setTimeout(() => setToast(''), 3000)
      return
    }

    try {
      const { id, ...rest } = current
      if (id) {
        await updateShlok(id, rest)
        setToast('Shlok updated successfully!')
      } else {
        await addShlok(rest)
        setToast('Shlok added successfully!')
      }
      setEditOpen(false)
      setCurrent(null)
      setErrors({})
      refresh()
      setTimeout(() => setToast(''), 3000)
    } catch (error) {
      console.error('Save error:', error)
      setToast('Error saving shlok: ' + error.message)
      setTimeout(() => setToast(''), 5000)
    }
  }

  async function onDelete() {
    if (!current?.id) return
    await deleteShlok(current.id)
    setConfirmOpen(false)
    setCurrent(null)
    refresh()
  }

  async function handleExport() {
    try {
      setExporting(true)
      setToast('Exporting shloks to JSON...')
      await exportBothJSON()
      setToast('JSON files downloaded successfully!')
      setTimeout(() => setToast(''), 3000)
    } catch (error) {
      console.error('Export error:', error)
      setToast('Error exporting JSON: ' + error.message)
      setTimeout(() => setToast(''), 5000)
    } finally {
      setExporting(false)
    }
  }

  function toggleTheme(theme) {
    setSelectedThemes((prev) => (
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    ))
  }

  function toggleChapter(ch) {
    setSelectedChapters((prev) => (
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    ))
  }

  const themeOptions = useMemo(() => {
    const set = new Set(rows.map((r) => r.theme).filter(Boolean))
    return Array.from(set).map((t) => ({ label: t, value: t }))
  }, [rows])

  const chapterOptions = useMemo(() => {
    const set = new Set(rows.map((r) => String(r.chapter)).filter(Boolean))
    return Array.from(set).map((c) => ({ label: `Chapter ${c}`, value: c }))
  }, [rows])

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const themeOk = selectedThemes.length === 0 || selectedThemes.includes(r.theme)
      const chapVal = r.chapter != null ? String(r.chapter) : ''
      const chapterOk = selectedChapters.length === 0 || selectedChapters.includes(chapVal)
      return themeOk && chapterOk
    })
  }, [rows, selectedThemes, selectedChapters])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Shloks</h2>
        <div className="flex gap-2">
          <button 
            className="btn btn-outline btn-sm" 
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Export to JSON'}
          </button>
          <button className="btn-gold" onClick={openNew}>Add Shlok</button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm font-medium mb-1">Filter by Theme</p>
          <FilterBar options={themeOptions} selected={selectedThemes} onToggle={toggleTheme} />
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Filter by Chapter</p>
          <FilterBar options={chapterOptions} selected={selectedChapters} onToggle={toggleChapter} />
        </div>
      </div>

      <DataTable columns={columns} data={filteredRows} onRowClick={openEdit} />

      <Modal open={editOpen} title={current?.id ? 'Edit Shlok' : 'Add Shlok'} onClose={() => { setEditOpen(false); setErrors({}); }}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {/* Chapter Number */}
            <div>
              <label className="block text-sm font-medium mb-1">Chapter # *</label>
              <input
                type="number"
                min="1"
                max="18"
                className={`input input-bordered w-full ${errors.chapter ? 'border-red-500' : ''}`}
                placeholder="1-18"
                value={current?.chapter || ''}
                onChange={(e) => setCurrent({ ...current, chapter: parseInt(e.target.value) || '' })}
              />
              {errors.chapter && <p className="text-red-500 text-xs mt-1">{errors.chapter}</p>}
            </div>

            {/* Shlok Number */}
            <div>
              <label className="block text-sm font-medium mb-1">Shlok # *</label>
              <input
                type="number"
                min="1"
                className={`input input-bordered w-full ${errors.shlokNumber ? 'border-red-500' : ''}`}
                placeholder="1, 2, 3..."
                value={current?.shlokNumber || ''}
                onChange={(e) => setCurrent({ ...current, shlokNumber: parseFloat(e.target.value) || '' })}
              />
              {errors.shlokNumber && <p className="text-red-500 text-xs mt-1">{errors.shlokNumber}</p>}
            </div>
          </div>

          {/* Chapter Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Chapter Name *</label>
            <input
              className={`input input-bordered w-full ${errors.chapterName ? 'border-red-500' : ''}`}
              placeholder="e.g., Arjun Vishaad Yog"
              value={current?.chapterName || ''}
              onChange={(e) => setCurrent({ ...current, chapterName: e.target.value })}
            />
            {errors.chapterName && <p className="text-red-500 text-xs mt-1">{errors.chapterName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Theme */}
            <div>
              <label className="block text-sm font-medium mb-1">Theme *</label>
              <input
                className={`input input-bordered w-full ${errors.theme ? 'border-red-500' : ''}`}
                placeholder="e.g., Strategy, Duty"
                value={current?.theme || ''}
                onChange={(e) => setCurrent({ ...current, theme: e.target.value })}
              />
              {errors.theme && <p className="text-red-500 text-xs mt-1">{errors.theme}</p>}
            </div>

            {/* Speaker */}
            <div>
              <label className="block text-sm font-medium mb-1">Speaker *</label>
              <input
                className={`input input-bordered w-full ${errors.speaker ? 'border-red-500' : ''}`}
                placeholder="e.g., Krishna, Arjun"
                value={current?.speaker || ''}
                onChange={(e) => setCurrent({ ...current, speaker: e.target.value })}
              />
              {errors.speaker && <p className="text-red-500 text-xs mt-1">{errors.speaker}</p>}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium mb-1">Keywords</label>
            <input
              className="input input-bordered w-full"
              placeholder="Space-separated keywords"
              value={current?.keywords || ''}
              onChange={(e) => setCurrent({ ...current, keywords: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Separate keywords with spaces</p>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium mb-1">Star Rating * (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              className={`input input-bordered w-full ${errors.star ? 'border-red-500' : ''}`}
              value={current?.star || 5}
              onChange={(e) => setCurrent({ ...current, star: parseInt(e.target.value) || 5 })}
            />
            {errors.star && <p className="text-red-500 text-xs mt-1">{errors.star}</p>}
          </div>

          {/* Summary / Meaning */}
          <div>
            <label className="block text-sm font-medium mb-1">Shlok Summary / Meaning *</label>
            <textarea
              className={`textarea textarea-bordered w-full ${errors.summary ? 'border-red-500' : ''}`}
              rows="3"
              placeholder="Enter the summary or meaning of the shlok"
              value={current?.summary || ''}
              onChange={(e) => setCurrent({ ...current, summary: e.target.value })}
            />
            {errors.summary && <p className="text-red-500 text-xs mt-1">{errors.summary}</p>}
          </div>

          {/* Video / AV Link */}
          <div>
            <label className="block text-sm font-medium mb-1">Video / AV Link</label>
            <input
              className="input input-bordered w-full"
              placeholder="e.g., 001 1.1.mp4 or YouTube URL"
              value={current?.videoLink || ''}
              onChange={(e) => setCurrent({ ...current, videoLink: e.target.value })}
            />
          </div>

          {/* Sanskrit / Devanagari */}
          <div>
            <label className="block text-sm font-medium mb-1">Sanskrit / Devanagari Text</label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows="2"
              placeholder="Enter Sanskrit shlok in Devanagari script"
              value={current?.sanskrit || ''}
              onChange={(e) => setCurrent({ ...current, sanskrit: e.target.value })}
            />
          </div>

          {/* English Translation */}
          <div>
            <label className="block text-sm font-medium mb-1">English Translation</label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows="2"
              placeholder="Enter English translation of the shlok"
              value={current?.translation || ''}
              onChange={(e) => setCurrent({ ...current, translation: e.target.value })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            {current?.id && (
              <button className="btn btn-error" onClick={() => setConfirmOpen(true)}>Delete</button>
            )}
            <button className="btn" onClick={() => { setEditOpen(false); setErrors({}); }}>Cancel</button>
            <button className="btn-gold" onClick={save}>Save</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Shlok"
        message={`Delete shlok ${current?.id}?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={onDelete}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="toast toast-top toast-center">
          <div className={`alert ${toast.includes('Error') || toast.includes('fix') ? 'alert-error' : 'alert-success'}`}>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  )
}
