package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseSummary;
import com.expensetracker.model.Expense;
import com.expensetracker.model.ExpenseType;
import com.expensetracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:4200")
public class ExpenseController {
    
    @Autowired
    private ExpenseService expenseService;
    
    @PostMapping
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense) {
        Expense savedExpense = expenseService.addExpense(expense);
        return ResponseEntity.ok(savedExpense);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Expense>> getUserExpenses(@PathVariable String userId) {
        List<Expense> expenses = expenseService.getUserExpenses(userId);
        return ResponseEntity.ok(expenses);
    }
    
    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<List<Expense>> getRecentExpenses(@PathVariable String userId, @RequestParam(defaultValue = "10") int limit) {
        List<Expense> expenses = expenseService.getRecentExpenses(userId, limit);
        return ResponseEntity.ok(expenses);
    }
    
    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<ExpenseSummary> getMonthlySummary(
            @PathVariable String userId,
            @RequestParam int year,
            @RequestParam int month) {
        ExpenseSummary summary = expenseService.getMonthlyExpenseSummary(userId, year, month);
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/user/{userId}/daterange")
    public ResponseEntity<List<Expense>> getExpensesInDateRange(
            @PathVariable String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Expense> expenses = expenseService.getUserExpensesInDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(expenses);
    }
    
    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<Expense>> getExpensesByType(
            @PathVariable String userId,
            @PathVariable ExpenseType type) {
        List<Expense> expenses = expenseService.getUserExpensesByType(userId, type);
        return ResponseEntity.ok(expenses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable String id) {
        return expenseService.getExpenseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable String id, @RequestBody Expense expenseDetails) {
        Expense updatedExpense = expenseService.updateExpense(id, expenseDetails);
        if (updatedExpense != null) {
            return ResponseEntity.ok(updatedExpense);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable String id) {
        boolean deleted = expenseService.deleteExpense(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
