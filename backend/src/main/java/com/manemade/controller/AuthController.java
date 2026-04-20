package com.manemade.controller;

import com.manemade.model.User;
import com.manemade.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
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
        return ResponseEntity.ok(Map.of(
            "success", true, 
            "message", "OTP generated successfully",
            "otp", otp
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body("Email and OTP are required");
        }

        if (authService.verifyOtp(email, otp)) {
            User user = authService.getUserByEmail(email);
            boolean isNewUser = authService.isNewUser(email);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "isNewUser", isNewUser,
                "user", user,
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
