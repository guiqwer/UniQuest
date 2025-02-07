package com.Uniquest.UniQuest.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    //Codigo para trocar a senha
    public void sendPasswordResetEmail(String to, String resetCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setTo(to);
            helper.setSubject("Código de Redefinição de Senha");
            helper.setText("Seu código de redefinição de senha é: " + resetCode);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //Código para trocar o email
    public void sendCodeChangeEmail(String to, String code){
        try{
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setTo(to);
            helper.setSubject("Código para Troca de Email");
            helper.setText("Seu código de Troca de Email é: " + code);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
