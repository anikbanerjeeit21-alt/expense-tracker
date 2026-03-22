package com.expensetracker.dto;

import java.math.BigDecimal;

public class ExpenseSummary {
    private BigDecimal totalDailyExpenses;
    private BigDecimal totalInvestments;
    private String month;
    private int year;
    
    public ExpenseSummary() {}
    
    public ExpenseSummary(BigDecimal totalDailyExpenses, BigDecimal totalInvestments, String month, int year) {
        this.totalDailyExpenses = totalDailyExpenses;
        this.totalInvestments = totalInvestments;
        this.month = month;
        this.year = year;
    }
    
    public BigDecimal getTotalDailyExpenses() {
        return totalDailyExpenses;
    }
    
    public void setTotalDailyExpenses(BigDecimal totalDailyExpenses) {
        this.totalDailyExpenses = totalDailyExpenses;
    }
    
    public BigDecimal getTotalInvestments() {
        return totalInvestments;
    }
    
    public void setTotalInvestments(BigDecimal totalInvestments) {
        this.totalInvestments = totalInvestments;
    }
    
    public String getMonth() {
        return month;
    }
    
    public void setMonth(String month) {
        this.month = month;
    }
    
    public int getYear() {
        return year;
    }
    
    public void setYear(int year) {
        this.year = year;
    }
}
