package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import com.expensetracker.model.ExpenseType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExpenseRepository extends MongoRepository<Expense, String> {
    
    List<Expense> findByUserIdOrderByDateDesc(String userId);
    
    List<Expense> findByUserIdAndDateBetweenOrderByDateDesc(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<Expense> findByUserIdAndTypeOrderByDateDesc(String userId, ExpenseType type);
    
    List<Expense> findByUserIdAndTypeAndDateBetweenOrderByDateDesc(String userId, ExpenseType type, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{ 'userId': ?0, 'date': { $gte: ?1, $lte: ?2 } }")
    List<Expense> findExpensesInDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query(value = "{ 'userId': ?0, 'type': ?1, 'date': { $gte: ?2, $lte: ?3 } }", count = true)
    long countExpensesByTypeAndDateRange(String userId, ExpenseType type, LocalDateTime startDate, LocalDateTime endDate);
}
