import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';
import { ExpenseType, DAILY_EXPENSE_CATEGORIES, INVESTMENT_CATEGORIES } from '../../models/expense.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  expenseTypes = Object.values(ExpenseType);
  dailyExpenseCategories = DAILY_EXPENSE_CATEGORIES;
  investmentCategories = INVESTMENT_CATEGORIES;
  currentCategories = this.dailyExpenseCategories;
  isLoading = false;
  currentUserId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router
  ) {
    this.expenseForm = this.fb.group({
      type: [ExpenseType.DAILY_EXPENSE, Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      currency: ['INR', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      date: [new Date(), Validators.required]
    });

    this.expenseForm.get('type')?.valueChanges.subscribe(type => {
      this.updateCategories(type);
    });
  }

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUser()?.id || null;
    this.expenseForm.patchValue({
      date: new Date()
    });
  }

  private updateCategories(expenseType: ExpenseType): void {
    if (expenseType === ExpenseType.DAILY_EXPENSE) {
      this.currentCategories = this.dailyExpenseCategories;
    } else {
      this.currentCategories = this.investmentCategories;
    }
    
    this.expenseForm.get('category')?.setValue('');
  }

  onSubmit(): void {
    if (this.expenseForm.valid && this.currentUserId) {
      this.isLoading = true;
      
      const expenseData = {
        ...this.expenseForm.value,
        userId: this.currentUserId,
        date: new Date(this.expenseForm.value.date)
      };

      this.expenseService.addExpense(expenseData)
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Error adding expense:', error);
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    }
  }

  getCategoryIcon(category: string): string {
    const categoryObj = this.currentCategories.find(cat => cat.name === category);
    return categoryObj ? categoryObj.icon : 'more_horiz';
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
