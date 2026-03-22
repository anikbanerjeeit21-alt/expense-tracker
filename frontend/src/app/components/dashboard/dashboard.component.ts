import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';
import { Expense, ExpenseSummary } from '../../models/expense.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentMonthSummary: ExpenseSummary | null = null;
  recentExpenses: Expense[] = [];
  selectedMonth: Date = new Date();
  isLoading = true;
  currentUserId: string | null = null;

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUser()?.id || null;
    if (this.currentUserId) {
      this.loadDashboardData();
    }
  }

  loadDashboardData(): void {
    if (!this.currentUserId) return;
    
    this.isLoading = true;
    const currentMonth = this.selectedMonth.getMonth() + 1; // Convert to 1-indexed for Java backend
    const currentYear = this.selectedMonth.getFullYear();

    this.expenseService.getExpenseSummary(this.currentUserId, currentMonth, currentYear)
      .subscribe({
        next: (summary) => {
          this.currentMonthSummary = summary;
        },
        error: (error) => {
          console.error('Error fetching summary:', error);
        }
      });

    this.expenseService.getRecentExpenses(this.currentUserId, 10)
      .subscribe({
        next: (expenses) => {
          this.recentExpenses = expenses;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching recent expenses:', error);
          this.isLoading = false;
        }
      });
  }

  onMonthChange(): void {
    this.loadDashboardData();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return this.datePipe.transform(dateObj, 'MMM dd, yyyy') || '';
  }

  getExpenseIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Food': 'restaurant',
      'Transport': 'directions_car',
      'Shopping': 'shopping_cart',
      'Entertainment': 'movie',
      'Bills': 'receipt',
      'Healthcare': 'local_hospital',
      'Education': 'school',
      'Stocks': 'trending_up',
      'Mutual Funds': 'account_balance',
      'Real Estate': 'home',
      'Bonds': 'description',
      'Cryptocurrency': 'currency_bitcoin',
      'Fixed Deposit': 'lock',
      'Gold': 'monetization_on',
      'Other': 'more_horiz'
    };
    return icons[category] || 'more_horiz';
  }

  deleteExpense(expenseId: string): void {
    this.expenseService.deleteExpense(expenseId)
      .subscribe({
        next: () => {
          this.loadDashboardData();
        },
        error: (error) => {
          console.error('Error deleting expense:', error);
        }
      });
  }
}
