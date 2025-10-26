import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ User API
export const registerUser = (userData) => API.post("/user/register", userData);

// ✅ Tag APIs
export const createTag = (tagData) => API.post("/tags/create", tagData);
export const getAllTags = () => API.get("/tags/list");
export const getTagsByDataType = (dataTypeCode) =>
  API.get(`/tags/list/${dataTypeCode}`);
export const getTagById = (id) => API.get(`/tags/${id}`);
export const getTagMainIdsByDataType = (dataTypeCode) =>
  API.get(`/tags/tagMainIds/${dataTypeCode}`);
export const getTagDetailsByTagMainId = (tagMainId) =>
  API.get(`/tags/tagDetails/${tagMainId}`);
export const updateTag = (id, updatedData) =>
  API.put(`/tags/update/${id}`, updatedData);
export const deleteTag = (id) => API.delete(`/tags/delete/${id}`);

// ✅ Book APIs
export const createBook = (bookData) => API.post("/books/create", bookData);
export const getAllBooks = () => API.get("/books/list");
export const getBookNamesOnly = () => API.get("/books/names");
export const getBookById = (slug) => API.get(`/books/${slug}`);
export const updateBook = (slug, updatedData) =>
  API.put(`/books/update/${slug}`, updatedData);
export const deleteBook = (slug) => API.delete(`/books/delete/${slug}`);
export const getBooksWithChapters = () => {
  return API.get('/books/with-chapters');
};

// Create new chapter
export const createChapter = (data) => {
  return API.post("/chapters", data);
};

export const getChapterCountByBookId = (bookId) => {
  return API.get(`/chapters/count/${bookId}`);
};

export const getChapters = () => API.get("/chapters");
export const getChapterById = (id) => API.get(`/chapters/${id}`);
export const updateChapter = (id, data) => API.put(`/chapters/${id}`, data);
export const deleteChapter = (id) => API.delete(`/chapters/${id}`);

export default API;
