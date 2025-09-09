// lib/axios.js
import axios from "axios";

// Determine the API base URL based on the Vercel environment.
// This is the most reliable way to handle different Vercel URLs.
let API_BASE_URL;

// Check if we are in a Vercel environment first.
if (process.env.VERCEL_ENV === 'production') {
    // In production, use the main project URL.
    API_BASE_URL = `https://${process.env.VERCEL_URL}`;
} else if (process.env.VERCEL_URL) {
    // In a preview environment (like a branch deployment), use the specific Vercel URL for that branch.
    API_BASE_URL = `https://${process.env.VERCEL_URL}`;
} else {
    // If we're not on Vercel (i.e., local development), use localhost.
    API_BASE_URL = "http://localhost:3001";
}

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export default api;
