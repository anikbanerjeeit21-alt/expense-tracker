package com.expensetracker.controller;

import com.expensetracker.model.User;
import com.expensetracker.service.UserService;
import com.expensetracker.service.GoogleOAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4300"})
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private GoogleOAuthService googleOAuthService;
    
    // Get Google OAuth URL
    @GetMapping("/google/url")
    public ResponseEntity<?> getGoogleAuthUrl() {
        try {
            String authUrl = googleOAuthService.getGoogleAuthUrl();
            return ResponseEntity.ok(Map.of("authUrl", authUrl));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating auth URL: " + e.getMessage());
        }
    }
    
    // Handle Google OAuth callback
    @PostMapping("/google/callback")
    public ResponseEntity<?> handleGoogleCallback(@RequestBody Map<String, String> callbackRequest) {
        try {
            String code = callbackRequest.get("code");
            
            if (code == null) {
                return ResponseEntity.badRequest().body("Authorization code is required");
            }
            
            // Exchange code for tokens
            Map<String, Object> tokens = googleOAuthService.exchangeCodeForTokens(code);
            String accessToken = (String) tokens.get("access_token");
            
            // Get user info from Google
            Map<String, Object> userInfo = googleOAuthService.getUserInfo(accessToken);
            
            // Create or update user in database
            User user = userService.createOrUpdateUser(
                (String) userInfo.get("email"),
                (String) userInfo.get("name"),
                (String) userInfo.get("picture"),
                (String) userInfo.get("id")
            );
            
            // Return clean user response
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId().toString());
            response.put("email", user.getEmail());
            response.put("name", user.getName());
            response.put("picture", user.getPicture());
            response.put("createdAt", user.getCreatedAt().toString());
            response.put("updatedAt", user.getUpdatedAt().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Authentication failed: " + e.getMessage());
        }
    }
    
    // Keep mock endpoint for development/fallback
    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestBody Map<String, String> googleAuthRequest) {
        try {
            String email = googleAuthRequest.get("email");
            String name = googleAuthRequest.get("name");
            String picture = googleAuthRequest.get("picture");
            String googleId = googleAuthRequest.get("googleId");
            
            if (email == null || googleId == null) {
                return ResponseEntity.badRequest().body("Email and Google ID are required");
            }
            
            User user = userService.createOrUpdateUser(email, name, picture, googleId);
            
            // Return a clean user object that matches frontend model
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId().toString());
            response.put("email", user.getEmail());
            response.put("name", user.getName());
            response.put("picture", user.getPicture());
            response.put("createdAt", user.getCreatedAt().toString());
            response.put("updatedAt", user.getUpdatedAt().toString());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Authentication error: " + e.getMessage());
        }
    }
    
    // Real OAuth endpoints (commented for now)
    /*
    @Autowired
    private GoogleOAuthService googleOAuthService;
    
    @GetMapping("/google/url")
    public ResponseEntity<?> getGoogleAuthUrl() {
        String authUrl = googleOAuthService.getGoogleAuthUrl();
        return ResponseEntity.ok(Map.of("authUrl", authUrl));
    }
    
    @PostMapping("/google/callback")
    public ResponseEntity<?> handleGoogleCallback(@RequestBody Map<String, String> callbackRequest) {
        String code = callbackRequest.get("code");
        
        if (code == null) {
            return ResponseEntity.badRequest().body("Authorization code is required");
        }
        
        try {
            // Exchange code for tokens
            Map<String, Object> tokens = googleOAuthService.exchangeCodeForTokens(code);
            String accessToken = (String) tokens.get("access_token");
            
            // Get user info from Google
            Map<String, Object> userInfo = googleOAuthService.getUserInfo(accessToken);
            
            // Create or update user in database
            User user = userService.createOrUpdateUser(
                (String) userInfo.get("email"),
                (String) userInfo.get("name"),
                (String) userInfo.get("picture"),
                (String) userInfo.get("id")
            );
            
            // Return clean user response
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId().toString());
            response.put("email", user.getEmail());
            response.put("name", user.getName());
            response.put("picture", user.getPicture());
            response.put("createdAt", user.getCreatedAt().toString());
            response.put("updatedAt", user.getUpdatedAt().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Authentication failed: " + e.getMessage());
        }
    }
    */
    
    @GetMapping("/user/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        if (user.isPresent()) {
            User userData = user.get();
            // Convert Long ID to String for frontend compatibility
            User responseUser = new User();
            responseUser.setId(userData.getId());
            responseUser.setEmail(userData.getEmail());
            responseUser.setName(userData.getName());
            responseUser.setPicture(userData.getPicture());
            responseUser.setGoogleId(userData.getGoogleId());
            responseUser.setCreatedAt(userData.getCreatedAt());
            responseUser.setUpdatedAt(userData.getUpdatedAt());
            return ResponseEntity.ok(responseUser);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
