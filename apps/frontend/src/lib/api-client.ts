import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/auth.store';

// ═══════════════════════════════════════════════════════════════════
// API Client — Hariventure Digital Production
// ═══════════════════════════════════════════════════════════════════

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  timeout: 30000,
  withCredentials: true, // Send httpOnly cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── CSRF HANDLING ───────────────────────────────────────────────────
let cachedCsrfToken: string | null = null;
let isFetchingCsrf = false;
let csrfSubscribers: Array<(token: string) => void> = [];

async function getCsrfToken(): Promise<string> {
  if (cachedCsrfToken) return cachedCsrfToken;
  
  if (isFetchingCsrf) {
    return new Promise((resolve) => {
      csrfSubscribers.push(resolve);
    });
  }

  isFetchingCsrf = true;
  try {
    const { data } = await axios.get(`${API_BASE_URL}/v1/auth/csrf`, { withCredentials: true });
    // TransformInterceptor wraps the response in { data: ... }
    const actualToken = data?.data?.csrfToken || data?.csrfToken;
    cachedCsrfToken = actualToken;
    csrfSubscribers.forEach((cb) => cb(cachedCsrfToken as string));
    csrfSubscribers = [];
    return cachedCsrfToken as string;
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error);
    return '';
  } finally {
    isFetchingCsrf = false;
  }
}

// ─── REQUEST INTERCEPTOR: Attach access token & CSRF ──────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const accessToken = useAuthStore.getState().accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      
      // Attach CSRF for mutating requests
      if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
        const csrfToken = await getCsrfToken();
        if (csrfToken) {
          if (config.headers && typeof config.headers.set === 'function') {
            config.headers.set('x-csrf-token', csrfToken);
          } else {
            config.headers['x-csrf-token'] = csrfToken;
          }
          console.log('[AXIOS INTERCEPTOR] CSRF Token Attached:', csrfToken);
          console.log('[AXIOS INTERCEPTOR] Headers Dump:', JSON.stringify(config.headers));
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── RESPONSE INTERCEPTOR: Handle 401 + token refresh ─────────────
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Do not attempt to refresh if the request was already an auth request (like login or verify)
    const isAuthEndpoint = originalRequest.url?.includes('/auth/client/login') ||
                           originalRequest.url?.includes('/auth/client/verify-otp') ||
                           originalRequest.url?.includes('/auth/internal/login');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Queue request while refresh is happening
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const csrfToken = await getCsrfToken();
        const { data } = await axios.post<{ accessToken: string }>(
          `${API_BASE_URL}/v1/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: { 'X-CSRF-Token': csrfToken }
          }
        );
        const newToken = data.accessToken;

        useAuthStore.getState().setAccessToken(newToken);
        onTokenRefreshed(newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear auth and redirect to appropriate login based on current path
        useAuthStore.getState().clearAuth();
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/client')) {
            window.location.href = '/auth/client/login';
          } else {
            window.location.href = '/auth/internal/login';
          }
          // Return a pending promise so the app halts execution while the browser redirects
          return new Promise(() => {});
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ─── TYPED REQUEST HELPERS ─────────────────────────────────────────

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await apiClient.get<{ data: T }>(url, { params });
  return data.data;
}

export async function post<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await apiClient.post<{ data: T }>(url, body);
  return data.data;
}

export async function patch<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await apiClient.patch<{ data: T }>(url, body);
  return data.data;
}

export async function del<T>(url: string): Promise<T> {
  const { data } = await apiClient.delete<{ data: T }>(url);
  return data.data;
}

export default apiClient;
