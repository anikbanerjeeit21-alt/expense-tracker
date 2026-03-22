import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  useRealOAuth = true; // Toggle between real OAuth and mock

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  loginWithGoogle(): void {
    this.isLoading = true;
    console.log('Login button clicked - OAuth mode:', this.useRealOAuth ? 'Real' : 'Mock');
    
    if (this.useRealOAuth) {
      // Use real Google OAuth
      this.authService.loginWithGoogle()
        .then(() => {
          console.log('Google OAuth initiated');
          // The redirect will handle the rest
        })
        .catch((error) => {
          console.error('Google OAuth failed:', error);
          alert('Google OAuth failed. Please try again.');
          this.isLoading = false;
        });
    } else {
      // Use mock login
      this.authService.loginWithMockGoogle()
        .then(() => {
          console.log('Mock login successful, navigating to dashboard');
          this.router.navigate(['/dashboard']);
        })
        .catch((error) => {
          console.error('Mock login failed:', error);
          alert('Login failed. Please try again.');
          this.isLoading = false;
        });
    }
  }

  toggleOAuthMode(): void {
    this.useRealOAuth = !this.useRealOAuth;
    console.log('OAuth mode:', this.useRealOAuth ? 'Real Google OAuth' : 'Mock OAuth');
  }
}
