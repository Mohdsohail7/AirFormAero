import API from "./axios";


// ----------------- Auth -----------------
export const loginWithAirtable = () => {
  // This will trigger the backend redirect → Airtable login
  window.location.href = `${API.defaults.baseURL}/auth/airtable`;
};

export const getCurrentUser = (userId) =>
  API.get(`/auth/me?userId=${userId}`);

// Airtable
export const fetchBases = (userId) => API.get(`/api/airtable/bases/${userId}`);
export const fetchTables = (userId, baseId) => API.get(`/api/airtable/tables/${userId}/${baseId}`);
export const fetchFields = (userId, baseId, tableId) =>
  API.get(`/api/airtable/fields/${userId}/${baseId}/${tableId}`);

// Forms
export const createForm = (data) => API.post("/api/forms", data);
export const updateForm = (id, data) => API.put(`/api/forms/${id}`, data);
export const getForm = (id) => API.get(`/api/forms/${id}`);
export const submitForm = (id, userId, answers) =>
  API.post(`/api/forms/${id}/submit?userId=${userId}`, { answers });
export const listForms = (userId) =>
  API.get(`/api/forms?ownerId=${userId}`);
export const deleteForm = (formId) => API.delete(`/api/forms/${formId}`);

