import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const int = (v) => (v === '' || v === null || v === undefined ? '' : String(v));
const toSlug = (s) =>
  (s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function BookForm({ initial = {}, onSaved, onCancel }) {
  const [form, setForm] = useState({
    recordNo: int(initial.recordNo),
    bookNo: int(initial.bookNo),
    bkGroupNo: int(initial.bkGroupNo),
    bookTitle: initial.bookTitle || '',
    bookIntro: initial.bookIntro || '',
    // required by backend (we SHOW them now)
    recMajor: int(initial.recMajor ?? 0),
    recMinor: int(initial.recMinor ?? 0),
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initial && (initial._id || initial.id));

  useEffect(() => {
    setForm({
      recordNo: int(initial.recordNo),
      bookNo: int(initial.bookNo),
      bkGroupNo: int(initial.bkGroupNo),
      bookTitle: initial.bookTitle || '',
      bookIntro: initial.bookIntro || '',
      recMajor: int(initial.recMajor ?? 0),
      recMinor: int(initial.recMinor ?? 0),
    });
  }, [initial]);

  const canSave = useMemo(() => {
    const e = {};
    if (form.recordNo === '') e.recordNo = 'Record No is required';
    if (form.bookNo === '') e.bookNo = 'Book No is required';
    if (form.bkGroupNo === '') e.bkGroupNo = 'Group No is required';
    if (!form.bookTitle.trim()) e.bookTitle = 'Book Title is required';

    ['recordNo', 'bookNo', 'bkGroupNo', 'recMajor', 'recMinor'].forEach((k) => {
      const v = String(form[k]).trim();
      if (v === '' || !/^-?\d+$/.test(v)) e[k] = 'Must be an integer';
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSave) return;

    const payload = {
      recordNo: Number(form.recordNo),
      bookNo: Number(form.bookNo),
      bkGroupNo: Number(form.bkGroupNo),
      bookTitle: form.bookTitle.trim(),
      bookIntro: form.bookIntro.trim(),
      recMajor: Number(form.recMajor),
      recMinor: Number(form.recMinor),
      slug: toSlug(form.bookTitle),
    };

    console.log('[BookForm] payload →', payload); // <— PROOF in DevTools

    try {
      setSaving(true);
      if (isEdit) {
        const id = initial._id || initial.id || initial.recordNo;
        await api.updateBook(id, payload);
      } else {
        await api.createBook(payload);
      }
      onSaved?.();
    } catch (err) {
      setErrors({ form: err.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="book-form" onSubmit={onSubmit}>
      {errors.form && <div className="error">{errors.form}</div>}

      <div className="grid">
        <label>
          <span>Record No *</span>
          <input
            inputMode="numeric"
            value={form.recordNo}
            onChange={(e) => setForm({ ...form, recordNo: e.target.value })}
            placeholder="e.g., 10"
          />
          {errors.recordNo && <small className="error">{errors.recordNo}</small>}
        </label>

        <label>
          <span>Book No *</span>
          <input
            inputMode="numeric"
            value={form.bookNo}
            onChange={(e) => setForm({ ...form, bookNo: e.target.value })}
            placeholder="e.g., 100"
          />
          {errors.bookNo && <small className="error">{errors.bookNo}</small>}
        </label>

        <label>
          <span>Group No *</span>
          <input
            inputMode="numeric"
            value={form.bkGroupNo}
            onChange={(e) => setForm({ ...form, bkGroupNo: e.target.value })}
            placeholder="e.g., 5"
          />
          {errors.bkGroupNo && <small className="error">{errors.bkGroupNo}</small>}
        </label>
      </div>

      <label>
        <span>Book Title *</span>
        <input
          value={form.bookTitle}
          onChange={(e) => setForm({ ...form, bookTitle: e.target.value })}
          placeholder="Enter a strong, clear title"
        />
        {errors.bookTitle && <small className="error">{errors.bookTitle}</small>}
      </label>

      <label>
        <span>Book Intro</span>
        <textarea
          rows={5}
          value={form.bookIntro}
          onChange={(e) => setForm({ ...form, bookIntro: e.target.value })}
          placeholder="Short introduction / synopsis"
        />
      </label>

      {/* NEW: show recMajor/recMinor + computed slug */}
      <div className="grid">
        <label>
          <span>recMajor *</span>
          <input
            inputMode="numeric"
            value={form.recMajor}
            onChange={(e) => setForm({ ...form, recMajor: e.target.value })}
            placeholder="e.g., 0"
          />
          {errors.recMajor && <small className="error">{errors.recMajor}</small>}
        </label>
        <label>
          <span>recMinor *</span>
          <input
            inputMode="numeric"
            value={form.recMinor}
            onChange={(e) => setForm({ ...form, recMinor: e.target.value })}
            placeholder="e.g., 0"
          />
          {errors.recMinor && <small className="error">{errors.recMinor}</small>}
        </label>
        <label>
          <span>slug (auto)</span>
          <input value={toSlug(form.bookTitle)} readOnly />
        </label>
      </div>

      <div className="actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button
          type="button"
          onClick={() =>
            setForm({
              recordNo: '',
              bookNo: '',
              bkGroupNo: '',
              bookTitle: '',
              bookIntro: '',
              recMajor: '0',
              recMinor: '0',
            })
          }
        >
          Clear
        </button>
        <button className="primary" disabled={saving || !canSave}>
          {saving ? 'Saving…' : 'Save Book'}
        </button>
      </div>
    </form>
  );
}
