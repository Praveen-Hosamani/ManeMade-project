package com.manemade.backend.controller;

import com.manemade.backend.service.AuthService;
import com.manemade.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Vite's default port
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/generate-otp")
    public ResponseEntity<?> generateOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        String otp = authService.generateOtp(email);
        // We return the OTP to the frontend so it can be sent via EmailJS
        return ResponseEntity.ok(Map.of("otp", otp, "message", "OTP generated successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        
        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body("Email and OTP are required");
        }
        
        boolean isValid = authService.verifyOtp(email, otp);
        if (isValid) {
            boolean isNewUser = authService.isNewUser(email);
            User user = authService.getUserByEmail(email);
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "isNewUser", isNewUser,
                "user", user != null ? user : Map.of("email", email),
                "message", "Login successful"
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid or expired OTP"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String firstName = request.get("firstName");
        String lastName = request.get("lastName");
        
        if (email == null || firstName == null || lastName == null) {
            return ResponseEntity.badRequest().body("Email, First Name, and Last Name are required");
        }
        
        User user = authService.completeProfile(email, firstName, lastName);
        if (user != null) {
            return ResponseEntity.ok(Map.of("success", true, "user", user));
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
}
