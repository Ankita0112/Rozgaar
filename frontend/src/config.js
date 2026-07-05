// Central place to configure the backend API base URL.
// During local development this points at your locally running backend (see backend/README).
// For production, set REACT_APP_API_BASE_URL as an environment variable when building.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3030";

export default API_BASE_URL;
