import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleOAuthService {
  private readonly apiUrl = 'http://localhost:8080/api';
  
  constructor(private http: HttpClient) {}

  getGoogleAuthUrl(): Observable<{authUrl: string}> {
    return this.http.get<{authUrl: string}>(`${this.apiUrl}/auth/google/url`);
  }

  handleGoogleCallback(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/google/callback`, { code });
  }

  initiateGoogleAuth(): void {
    this.getGoogleAuthUrl().subscribe({
      next: (response) => {
        // Redirect to Google OAuth
        window.location.href = response.authUrl;
      },
      error: (error) => {
        console.error('Error getting Google auth URL:', error);
      }
    });
  }

  // Check if we have an OAuth code in the URL (for callback handling)
  getOAuthCodeFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
  }

  // Clear OAuth code from URL
  clearOAuthCodeFromUrl(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    window.history.replaceState({}, document.title, url.toString());
  }
}
