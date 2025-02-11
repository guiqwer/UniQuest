package com.Uniquest.UniQuest.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String resetCode) {
        sendEmail(to, "Código de Redefinição de Senha", "Seu código de redefinição de senha é: " + resetCode);
    }

    public void sendCodeChangeEmail(String to, String code) {
        sendEmail(to, "Código para Troca de Email", "Seu código de troca de email é: " + code);
    }

    public void sendConfirmEmail(String to, String code) {
        sendEmail(to, "Código para Confirmação de Email", "Seu código de confirmação é: " + code);
    }

    private void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar e-mail para: " + to, e);
        }
    }
}
