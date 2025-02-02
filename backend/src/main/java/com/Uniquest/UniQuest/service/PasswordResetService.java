package com.Uniquest.UniQuest.services;

import com.Uniquest.UniQuest.domain.user.PasswordResetCode;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.repositories.PasswordResetCodeRepository;
import com.Uniquest.UniQuest.repositories.UserRepository;
import com.Uniquest.UniQuest.service.EmailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetCodeRepository codeRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public PasswordResetService(UserRepository userRepository, PasswordResetCodeRepository codeRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.codeRepository = codeRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public Optional<PasswordResetCode> createPasswordResetCode(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        User user = userOpt.get();
        PasswordResetCode code = new PasswordResetCode(user);

        try {
            codeRepository.save(code);
            emailService.sendPasswordResetEmail(user.getEmail(), code.getResetCode());
            return Optional.of(code);
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    public boolean resetPassword(String resetCode, String newPassword) {
        Optional<PasswordResetCode> codeOpt = codeRepository.findByResetCode(resetCode);
        if (codeOpt.isEmpty()) {
            return false;
        }

        PasswordResetCode resetCodeObj = codeOpt.get();

        if (resetCodeObj.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            return false;
        }

        User user = resetCodeObj.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        codeRepository.delete(resetCodeObj);
        return true;
    }
}
