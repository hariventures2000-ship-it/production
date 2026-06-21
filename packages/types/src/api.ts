// ═══════════════════════════════════════════════════════════════════
// HARIVENTURE DIGITAL PRODUCTION — API Response Types
// ═══════════════════════════════════════════════════════════════════

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
}

export interface FileUploadResponse {
  url: string;
  publicId: string;
  format: string;
  sizeBytes: number;
  width?: number;
  height?: number;
}
