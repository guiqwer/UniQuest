package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.domain.user.EmailChangeCode;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.repositories.EmailChangeCodeRepository;
import com.Uniquest.UniQuest.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmailChangeService {

    @Autowired
    private UserRepository userRepository; // Repositório de usuários
    @Autowired
    private EmailChangeCodeRepository emailChangeCodeRepository; // Repositório de códigos de troca de e-mail
    @Autowired
    private EmailService emailService; // Serviço de envio de e-mail


    public Optional<EmailChangeCode> createEmailChangeCode(String currentEmail, String newEmail) {
        Optional<User> userOpt = userRepository.findByEmail(currentEmail);
        if (userOpt.isEmpty()) {
            return Optional.empty();  // Caso o e-mail atual não exista.
        }

        // Verifica se o novo e-mail já está cadastrado
        if (userRepository.existsByEmail(newEmail)) {
            return Optional.empty();  // Se o novo e-mail já estiver em uso, não deixa continuar.
        }

        User user = userOpt.get();
        EmailChangeCode code = new EmailChangeCode(user, newEmail);  // A mudança é aqui, para associar ao novo e-mail.

        try {
            emailChangeCodeRepository.save(code);  // Salva o código gerado.
            emailService.sendCodeChangeEmail(newEmail, code.getCode());  // Envia o código para o novo e-mail.
            return Optional.of(code);
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    public boolean confirmEmailChange(String currentEmail, String code, String newEmail) {
        Optional<EmailChangeCode> codeOpt = emailChangeCodeRepository.findByCode(code);
        if (codeOpt.isEmpty()) {
            return false;
        }

        EmailChangeCode emailChangeCode = codeOpt.get();
        if (emailChangeCode.getUser().getEmail().equals(currentEmail) && emailChangeCode.getNewEmail().equals(newEmail)) {
            User user = emailChangeCode.getUser();
            user.setEmail(newEmail);  // Atualiza o e-mail do usuário
            userRepository.save(user);
            emailChangeCodeRepository.delete(emailChangeCode);  // Remove o código usado
            return true;
        }

        return false;
    }



}
