package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.domain.user.PasswordResetCode;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.exceptions.*;
import com.Uniquest.UniQuest.repositories.PasswordResetCodeRepository;
import com.Uniquest.UniQuest.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetCodeRepository codeRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // Método para criar o código de redefinição de senha
    public Optional<PasswordResetCode> createPasswordResetCode(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("Usuário com e-mail " + email + " não encontrado.");
        }

        User user = userOpt.get();
        PasswordResetCode code = new PasswordResetCode(user);

        try {
            codeRepository.save(code);
            emailService.sendPasswordResetEmail(user.getEmail(), code.getResetCode());
            return Optional.of(code);
        } catch (Exception e) {
            throw new PasswordResetEmailException("Erro ao enviar o e-mail de redefinição de senha.");
        }
    }

    // Método para redefinir a senha
    public boolean resetPassword(String resetCode, String newPassword) {
        Optional<PasswordResetCode> codeOpt = codeRepository.findByResetCode(resetCode);
        if (codeOpt.isEmpty()) {
            throw new PasswordResetCodeNotFoundException("Código de redefinição de senha não encontrado.");
        }

        PasswordResetCode resetCodeObj = codeOpt.get();

        // Verificando se o código expirou
        if (resetCodeObj.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            throw new ExpiredResetCodeException("O código de redefinição de senha expirou.");
        }

        User user = resetCodeObj.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        codeRepository.delete(resetCodeObj);
        return true;
    }
}
