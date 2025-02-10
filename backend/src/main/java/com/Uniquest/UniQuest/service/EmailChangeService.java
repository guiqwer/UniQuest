package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.domain.user.EmailChangeCode;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.exceptions.*;
import com.Uniquest.UniQuest.repositories.EmailChangeCodeRepository;
import com.Uniquest.UniQuest.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmailChangeService {

    private final UserRepository userRepository;  // Agora é final, Lombok vai injetar automaticamente
    private final EmailChangeCodeRepository emailChangeCodeRepository;  // Também final
    private final EmailService emailService;  // Final também

    public EmailChangeCode createEmailChangeCode(String currentEmail, String newEmail) {
        Optional<User> userOpt = userRepository.findByEmail(currentEmail);
        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("Usuário com e-mail " + currentEmail + " não encontrado.");
        }

        if (userRepository.existsByEmail(newEmail)) {
            throw new EmailAlreadyExistsException("O e-mail " + newEmail + " já está em uso.");
        }

        User user = userOpt.get();
        EmailChangeCode code = new EmailChangeCode(user, newEmail);

        try {
            emailChangeCodeRepository.save(code);
            emailService.sendCodeChangeEmail(newEmail, code.getCode());
            return code;
        } catch (Exception e) {
            throw new EmailChangeProcessException("Erro ao salvar ou enviar código de alteração de e-mail.", e);
        }
    }

    public boolean confirmEmailChange(String currentEmail, String code, String newEmail) {
        Optional<EmailChangeCode> codeOpt = emailChangeCodeRepository.findByCode(code);
        if (codeOpt.isEmpty()) {
            throw new InvalidCodeException("Código de alteração de e-mail inválido.");
        }

        EmailChangeCode emailChangeCode = codeOpt.get();
        if (!emailChangeCode.getUser().getEmail().equals(currentEmail)) {
            throw new EmailMismatchException("O e-mail atual não corresponde ao registrado.");
        }

        if (!emailChangeCode.getNewEmail().equals(newEmail)) {
            throw new EmailMismatchException("O novo e-mail não corresponde ao informado.");
        }

        try {
            User user = emailChangeCode.getUser();
            user.setEmail(newEmail);  // Atualiza o e-mail do usuário
            userRepository.save(user);
            emailChangeCodeRepository.delete(emailChangeCode);  // Remove o código usado
            return true;
        } catch (Exception e) {
            throw new EmailChangeFailedException("Erro ao alterar o e-mail.");
        }
    }
}
