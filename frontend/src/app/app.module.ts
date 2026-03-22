import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import { ExpenseService } from './services/expense.service';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ExpenseFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    GoogleOAuthService,
    ExpenseService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
