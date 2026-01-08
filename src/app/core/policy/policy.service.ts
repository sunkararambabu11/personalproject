import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../shared/api/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  constructor(private http: HttpClient) {}

  createPolicy = (options: any) => {
    const defaults = {
      url: API_ENDPOINTS.createPolicy
    };
    this.post(defaults, options);
  };

  getAllPolicies = (options: any) => {
    const userId = options.data?.userId || localStorage.getItem('token') || '';
    const page = options.data?.page || 1;
    const limit = options.data?.limit || 10;
    
    const defaults = {
      url: `${API_ENDPOINTS.getAllPolicies}?userId=${userId}&page=${page}&limit=${limit}`
    };
    this.get(defaults, options);
  };

  searchPolicies = (options: any) => {
    const userId = options.data?.userId || localStorage.getItem('token') || '';
    const query = options.data?.query || '';
    const page = options.data?.page || 1;
    const limit = options.data?.limit || 10;
    
    const defaults = {
      url: `${API_ENDPOINTS.searchPolicies}?userId=${userId}&query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    };
    this.get(defaults, options);
  };

  getPolicyByNumber = (options: any) => {
    const policyNumber = options.data?.policyNumber || '';
    
    const defaults = {
      url: `${API_ENDPOINTS.getPolicyByNumber}/${policyNumber}`
    };
    this.get(defaults, options);
  };

  updatePolicy = (options: any) => {
    const policyNumber = options.data?.policyNumber || '';
    
    const defaults = {
      url: `${API_ENDPOINTS.updatePolicy}/${policyNumber}`
    };
    this.put(defaults, options);
  };

  put = (defaults: any, options: any) => {
    const settings = { ...defaults, ...options };
    const requestBody = settings.data?.body || {};
    const headers = settings.data?.headers || {};

    this.http.put(settings.url, requestBody, { headers }).subscribe({
      next: (response) => {
        if (settings.success) settings.success(response);
      },
      error: (error) => {
        if (settings.failure) settings.failure(error);
      },
      complete: () => {
        if (settings.complete) settings.complete(true);
      }
    });
  };

  post = (defaults: any, options: any) => {
    const settings = { ...defaults, ...options };
    const requestBody = settings.data?.body || {};
    const headers = settings.data?.headers || {};

    this.http.post(settings.url, requestBody, { headers }).subscribe({
      next: (response) => {
        if (settings.success) settings.success(response);
      },
      error: (error) => {
        if (settings.failure) settings.failure(error);
      },
      complete: () => {
        if (settings.complete) settings.complete(true);
      }
    });
  };

  get = (defaults: any, options: any) => {
    const settings = { ...defaults, ...options };
    this.http.get(settings.url).subscribe({
      next: (response) => {
        if (settings.success) settings.success(response);
      },
      error: (error) => {
        if (settings.failure) settings.failure(error);
      },
      complete: () => {
        if (settings.complete) settings.complete(true);
      }
    });
  };

  deletePolicy = (options: any) => {
    const policyNumber = options.data?.policyNumber || '';
    
    const defaults = {
      url: `${API_ENDPOINTS.deletePolicy}/${policyNumber}`
    };
    this.delete(defaults, options);
  };

  getLocations = (options: any) => {
    const defaults = {
      url: API_ENDPOINTS.getLocations
    };
    this.get(defaults, options);
  };

  delete = (defaults: any, options: any) => {
    const settings = { ...defaults, ...options };

    this.http.delete(settings.url).subscribe({
      next: (response) => {
        if (settings.success) settings.success(response);
      },
      error: (error) => {
        if (settings.failure) settings.failure(error);
      },
      complete: () => {
        if (settings.complete) settings.complete(true);
      }
    });
  };
}

