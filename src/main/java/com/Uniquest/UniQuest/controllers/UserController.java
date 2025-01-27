package com.Uniquest.UniQuest.controllers;


import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.repositories.UserRepository;
import com.Uniquest.UniQuest.service.EmailService;
import com.Uniquest.UniQuest.service.UserService;
import com.Uniquest.UniQuest.utils.GenericResponse;
import com.Uniquest.UniQuest.utils.UrlUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.web.bind.annotation.*;


import java.util.UUID;

import static com.Uniquest.UniQuest.utils.UrlUtil.getAppUrl;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private JavaMailSender mailSender;
    private final EmailService emailService;
    private GenericResponse message;

    public UserController(UserService userService, JavaMailSenderImpl mailSender, EmailService emailService) {
        this.userService = userService;
        this.mailSender = mailSender;
        this.emailService = emailService;
    }

    @PostMapping("/resetPassword")
    public GenericResponse resetPassword(HttpServletRequest request,
                                         @RequestParam("email") String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        String token = UUID.randomUUID().toString();
        userService.createPasswordResetTokenForUser(user, token);

        // Passar o appUrl para o método constructResetTokenEmail
        mailSender.send(emailService.constructResetTokenEmail(getAppUrl(request), request.getLocale(), token, user));

        return new GenericResponse(message.getMessage());
    }


}
