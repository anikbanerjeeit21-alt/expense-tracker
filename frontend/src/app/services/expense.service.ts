import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Expense, ExpenseType, ExpenseSummary } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:8080/api/expenses';
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  public expenses$ = this.expensesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserExpenses();
  }

  private loadUserExpenses(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id) {
      this.getExpenses(currentUser.id).subscribe(expenses => {
        this.expensesSubject.next(expenses);
      });
    }
  }

  addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  getExpenses(userId: string, startDate?: Date, endDate?: Date): Observable<Expense[]> {
    let url = `${this.apiUrl}/user/${userId}`;
    if (startDate && endDate) {
      url += `/daterange?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    }
    return this.http.get<Expense[]>(url);
  }

  getRecentExpenses(userId: string, limit: number = 10): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/user/${userId}/recent?limit=${limit}`);
  }

  getExpenseSummary(userId: string, month: number, year: number): Observable<ExpenseSummary> {
    return this.http.get<ExpenseSummary>(`${this.apiUrl}/user/${userId}/summary?year=${year}&month=${month}`);
  }

  getExpensesByType(userId: string, type: ExpenseType): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/user/${userId}/type/${type}`);
  }

  updateExpense(id: string, expense: Partial<Expense>): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expense);
  }

  deleteExpense(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  refreshExpenses(): void {
    this.loadUserExpenses();
  }
}
