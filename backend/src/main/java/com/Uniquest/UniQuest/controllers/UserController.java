package com.Uniquest.UniQuest.controllers;


import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.RegisterRequestDTO;
import com.Uniquest.UniQuest.dto.ResponseDTO;
import com.Uniquest.UniQuest.dto.UserProfileAvatarDTO;
import com.Uniquest.UniQuest.dto.UserProfileDTO;
import com.Uniquest.UniQuest.exceptions.ServerErrorException;
import com.Uniquest.UniQuest.exceptions.UserNotFoundException;
import com.Uniquest.UniQuest.infra.security.TokenService;
import com.Uniquest.UniQuest.repositories.UserRepository;
import com.Uniquest.UniQuest.service.EmailService;
import com.Uniquest.UniQuest.service.UserService;
import com.Uniquest.UniQuest.utils.GenericResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.Uniquest.UniQuest.services.PasswordResetService;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;


@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private JavaMailSender mailSender;
    private final EmailService emailService;
    private GenericResponse message;


    private final UserRepository repository;

    private final PasswordEncoder passwordEncoder;

    private final TokenService tokenService;

    private final PasswordResetService passwordResetService;



    @GetMapping
    public ResponseEntity<?> getUserInfo(HttpServletRequest request) {
        // Extrai o token do cabeçalho da requisição
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Token não fornecido ou inválido");
        }
        String token = authHeader.replace("Bearer ", "");
        // Valida o token e extrai o email do usuário
        String userEmail = tokenService.validateToken(token);
        if (userEmail == null) {
            return ResponseEntity.status(401).body("Token inválido ou expirado");
        }
        // Busca o usuário no banco de dados pelo email
        Optional<User> userOptional = repository.findByEmail(userEmail);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }
        User user = userOptional.get();
        // Cria um Map para retornar apenas as informações necessárias
        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());
        return ResponseEntity.ok(userInfo);
    }


    @PostMapping("/resetPassword")
    public GenericResponse resetPassword(HttpServletRequest request,
                                         @RequestParam("email") String userEmail) {

        User user = userService.findUserByEmail(userEmail);

        if (user == null) {
            throw new UserNotFoundException();
        }

        String token = UUID.randomUUID().toString();
        userService.createPasswordResetCodeForUser(token, user);

        try {
            // Passar o appUrl para o método constructResetTokenEmail
            return new GenericResponse(message.getMessage());
        } catch (RuntimeException e) {
            throw new ServerErrorException();
        }

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


    //Endpoint para editar o perfil do usuário
    @PutMapping("/edit-profile/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody UserProfileDTO updateUserProfile) {
        User updatedUser = userService.updateUserProfile(id, updateUserProfile);
        return ResponseEntity.ok(updatedUser);
    }


    @PutMapping("/avatar/{id}")
    public ResponseEntity<User> updateUserAvatar(
            @PathVariable String id,
            @RequestParam("avatarFile") MultipartFile avatarFile
    ) {
        try {
            UserProfileAvatarDTO dto = new UserProfileAvatarDTO(avatarFile);
            User updatedUser = userService.updateUserAvatar(id, dto);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }


    // Endpoint para deletar o avatar do usuário
    @DeleteMapping("/avatar/{id}")
    public ResponseEntity<Void> deleteUserAvatar(@PathVariable String id) {
        try {
            userService.deleteUserAvatar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        var codeOpt = passwordResetService.createPasswordResetCode(email);
        if (codeOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Email não encontrado.");
        }
        return ResponseEntity.ok("Código de redefinição enviado para o seu email.");
    }


    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String resetCode = request.get("resetCode");
        String newPassword = request.get("newPassword");

        if (passwordResetService.resetPassword(resetCode, newPassword)) {
            return ResponseEntity.ok("Senha redefinida com sucesso.");
        }
        return ResponseEntity.badRequest().body("Código inválido ou expirado.");
    }
}
