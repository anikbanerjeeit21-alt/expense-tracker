import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { GoogleOAuthService } from './google-oauth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private googleOAuthService: GoogleOAuthService
  ) {
    this.checkAuthStatus();
    this.checkOAuthCallback();
  }

  private checkAuthStatus(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  loginWithGoogle(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Starting real Google OAuth...');
      
      // Initiate real Google OAuth
      this.googleOAuthService.initiateGoogleAuth();
      resolve(); // The redirect will handle the rest
    });
  }

  private checkOAuthCallback(): void {
    const code = this.googleOAuthService.getOAuthCodeFromUrl();
    if (code) {
      console.log('OAuth callback detected, handling code...');
      this.handleOAuthCallback();
    }
  }

  private handleOAuthCallback(): void {
    const code = this.googleOAuthService.getOAuthCodeFromUrl();
    
    if (!code) {
      console.error('No authorization code found');
      return;
    }

    this.googleOAuthService.handleGoogleCallback(code).subscribe({
      next: (user) => {
        console.log('OAuth successful, user:', user);
        
        // Convert date strings to Date objects
        if (user.createdAt) {
          user.createdAt = new Date(user.createdAt);
        }
        if (user.updatedAt) {
          user.updatedAt = new Date(user.updatedAt);
        }
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        
        // Clear the code from URL
        this.googleOAuthService.clearOAuthCodeFromUrl();
        
        console.log('User successfully authenticated with Google');
      },
      error: (error) => {
        console.error('OAuth callback failed:', error);
        this.googleOAuthService.clearOAuthCodeFromUrl();
      }
    });
  }

  // Mock login for fallback
  loginWithMockGoogle(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Starting mock Google login...');
      
      const mockGoogleAuth = {
        email: 'user@example.com',
        name: 'Demo User',
        picture: 'https://via.placeholder.com/50',
        googleId: '123456789'
      };

      this.http.post<User>(`${this.apiUrl}/google`, mockGoogleAuth)
        .subscribe({
          next: (user) => {
            console.log('Mock auth response received:', user);
            if (user.createdAt) {
              user.createdAt = new Date(user.createdAt);
            }
            if (user.updatedAt) {
              user.updatedAt = new Date(user.updatedAt);
            }
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
            console.log('User logged in successfully with mock');
            resolve();
          },
          error: (error) => {
            console.error('Mock login failed:', error);
            reject(error);
          }
        });
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    // Notify backend about logout (optional)
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
