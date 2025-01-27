package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.domain.user.PasswordResetToken;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.repositories.PasswordResetTokenRepository;
import com.Uniquest.UniQuest.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, PasswordResetTokenRepository passwordResetTokenRepository) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    }

    public void createPasswordResetTokenForUser(User user, String token) {
        PasswordResetToken mytoken = new PasswordResetToken(token, user);
        passwordResetTokenRepository.save(mytoken);
    }
}
