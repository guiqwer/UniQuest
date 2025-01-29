package com.Uniquest.UniQuest.controllers;


import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.RegisterRequestDTO;
import com.Uniquest.UniQuest.dto.ResponseDTO;
import com.Uniquest.UniQuest.infra.security.TokenService;
import com.Uniquest.UniQuest.repositories.UserRepository;
import com.Uniquest.UniQuest.service.EmailService;
import com.Uniquest.UniQuest.service.UserService;
import com.Uniquest.UniQuest.utils.GenericResponse;
import com.Uniquest.UniQuest.utils.UrlUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.Optional;
import java.util.UUID;

import static com.Uniquest.UniQuest.utils.UrlUtil.getAppUrl;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private JavaMailSender mailSender;
    private final EmailService emailService;
    private GenericResponse message;

    @Autowired
    private final UserRepository repository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final TokenService tokenService;

    public UserController(UserService userService, JavaMailSenderImpl mailSender, EmailService emailService, UserRepository repository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.userService = userService;
        this.mailSender = mailSender;
        this.emailService = emailService;
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
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

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequestDTO body){
        Optional<User> user = this.repository.findByEmail(body.email());

        if(user.isEmpty()) {
            User newUser = new User();
            newUser.setPassword(passwordEncoder.encode(body.password()));
            newUser.setEmail(body.email());
            newUser.setName(body.name());
            this.repository.save(newUser);

            String token = this.tokenService.generateToken(newUser);
            return ResponseEntity.ok(new ResponseDTO(newUser.getName(), token));
        }
        return ResponseEntity.badRequest().build();
    }


}
