package com.expensetracker.service;

import com.expensetracker.dto.ExpenseSummary;
import com.expensetracker.model.Expense;
import com.expensetracker.model.ExpenseType;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    public Expense addExpense(Expense expense) {
        expense.setUpdatedAt(LocalDateTime.now());
        return expenseRepository.save(expense);
    }
    
    public Optional<Expense> getExpenseById(String id) {
        return expenseRepository.findById(id);
    }
    
    public List<Expense> getUserExpenses(String userId) {
        return expenseRepository.findByUserIdOrderByDateDesc(userId);
    }
    
    public List<Expense> getUserExpensesInDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        return expenseRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate);
    }
    
    public List<Expense> getUserExpensesByType(String userId, ExpenseType type) {
        return expenseRepository.findByUserIdAndTypeOrderByDateDesc(userId, type);
    }
    
    public ExpenseSummary getMonthlyExpenseSummary(String userId, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        
        List<Expense> expenses = expenseRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate);
        
        BigDecimal totalDailyExpenses = expenses.stream()
                .filter(expense -> expense.getType() == ExpenseType.DAILY_EXPENSE)
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalInvestments = expenses.stream()
                .filter(expense -> expense.getType() == ExpenseType.INVESTMENT)
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        String monthName = yearMonth.getMonth().toString();
        
        return new ExpenseSummary(totalDailyExpenses, totalInvestments, monthName, year);
    }
    
    public Expense updateExpense(String id, Expense expenseDetails) {
        Optional<Expense> optionalExpense = expenseRepository.findById(id);
        if (optionalExpense.isPresent()) {
            Expense expense = optionalExpense.get();
            expense.setType(expenseDetails.getType());
            expense.setAmount(expenseDetails.getAmount());
            expense.setCategory(expenseDetails.getCategory());
            expense.setDescription(expenseDetails.getDescription());
            expense.setDate(expenseDetails.getDate());
            expense.setUpdatedAt(LocalDateTime.now());
            return expenseRepository.save(expense);
        }
        return null;
    }
    
    public boolean deleteExpense(String id) {
        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<Expense> getRecentExpenses(String userId, int limit) {
        List<Expense> expenses = expenseRepository.findByUserIdOrderByDateDesc(userId);
        return expenses.stream().limit(limit).toList();
    }
}
