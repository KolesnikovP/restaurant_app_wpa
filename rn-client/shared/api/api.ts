import axios from 'axios';
// import { USER_LOCALSTORAGE_KEY } from '@/shared/const/localstorage';

// Prefer VITE_API_URL when provided, otherwise default to same-origin '/api'.
//

const API_BASE = process.env.EXPO_PUBLIC_API_URL || '/api';

export const $api = axios.create({
    baseURL: API_BASE,
});

