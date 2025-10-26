// CGL FRONTEND API MODULE (v1)
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function http(method, path, data) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (data !== undefined) opts.body = JSON.stringify(data);

  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = { message: text }; }

  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  return json;
}

export const api = {
  listBooks: () => http('GET', '/books'),
  getBook: (id) => http('GET', `/books/${id}`),
  createBook: (book) => http('POST', '/books', book),
  updateBook: (id, book) => http('PUT', `/books/${id}`, book),
  deleteBook: (id) => http('DELETE', `/books/${id}`),
};
