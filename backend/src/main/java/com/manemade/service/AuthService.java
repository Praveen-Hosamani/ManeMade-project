package com.manemade.service;

import com.manemade.model.User;
import com.manemade.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public String generateOtp(String email) {
        String otp = String.format("%06d", (int) (Math.random() * 1000000)); // 6-digit OTP
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        boolean isNew = userOpt.isEmpty();
        User user = userOpt.orElseGet(() -> {
            User newUser = new User(email);
            newUser.setCreatedAt(LocalDateTime.now());
            return newUser;
        });
        
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);
        System.out.println("OTP for " + email + " is: " + otp);
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getOtp() != null && user.getOtp().equals(otp) && user.getOtpExpiry().isAfter(LocalDateTime.now())) {
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

    // New management methods
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
