package com.manemade.backend.service;

import com.manemade.backend.model.User;
import com.manemade.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        User user = userRepository.findByEmail(email).orElse(new User(email));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);
        
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getOtp() != null && user.getOtp().equals(otp) && 
                user.getOtpExpiry().isAfter(LocalDateTime.now())) {
                
                // Clear OTP after successful verification
                user.setOtp(null);
                user.setOtpExpiry(null);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public boolean isNewUser(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.isPresent() && (userOpt.get().getFirstName() == null || userOpt.get().getFirstName().isEmpty());
    }

    public User completeProfile(String email, String firstName, String lastName) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            return userRepository.save(user);
        }
        return null;
    }
}
