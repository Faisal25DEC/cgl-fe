
import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import BookForm from '../components/BookForm';
import './book.css';

export default function BookPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');

  async function refresh() {
    try {
      setLoading(true);
      setError('');
      const data = await api.listBooks();
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(b =>
      [b.recordNo, b.bookNo, b.bkGroupNo, b.bookTitle, b.bookIntro]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q))
    );
  }, [items, query]);

  return (
    <div className="book-page">
      <header className="book-header">
        <h1>Books</h1>
        <div className="row">
          <input
            placeholder="Search (Record No, Book No, Title...)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="search"
          />
          <button className="primary" onClick={() => setEditing({})}>
            + New Book
          </button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="ghost">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="ghost">No books yet.</div>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>Record No</th>
              <th>Book No</th>
              <th>Group No</th>
              <th>Title</th>
              <th>Intro</th>
              <th style={{width: 160}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b._id || `${b.recordNo}-${b.bookNo}`}>
                <td>{b.recordNo}</td>
                <td>{b.bookNo}</td>
                <td>{b.bkGroupNo}</td>
                <td>{b.bookTitle}</td>
                <td className="intro">{b.bookIntro}</td>
                <td>
                  <button onClick={() => setEditing(b)}>Edit</button>
                  <button className="danger" onClick={async () => {
                    if (!confirm('Delete this book?')) return;
                    try {
                      await api.deleteBook(b._id || b.id || b.recordNo);
                      await refresh();
                    } catch (e) {
                      setError(e.message);
                    }
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing !== null && (
        <div className="modal">
          <div className="card">
            <div className="card-head">
              <h2>{editing?._id ? 'Edit Book' : 'New Book'}</h2>
              <button className="icon" onClick={() => setEditing(null)}>✕</button>
            </div>
            <BookForm
              initial={editing}
              onCancel={() => setEditing(null)}
              onSaved={async () => { setEditing(null); await refresh(); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
