package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.utils.GenericResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    private GenericResponse message;

    @Value("{spring.mail.username}")
    private String sender;

    public SimpleMailMessage constructResetTokenEmail(
            String appUrl, Locale locale, String token, User user) {
        String url = appUrl + "/user/changePassword?token=" + token;
        message.getMessage();
        return constructEmail("Reset Password", message + " \r\n" + url, user);
    }


    private SimpleMailMessage constructEmail(String subject, String body, User user) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setSubject(subject);
        email.setText(body);
        email.setTo(user.getEmail());
        email.setFrom("guilherme.souza0996@gmail.com"); // Use o e-mail do remetente aqui
        return email;
    }

}
