package com.Uniquest.UniQuest.controllers;

import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.user.EmailChangeCode;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.auth.RegisterRequestDTO;
import com.Uniquest.UniQuest.dto.common.ResponseDTO;
import com.Uniquest.UniQuest.dto.exam.ExamListResponseDTO;
import com.Uniquest.UniQuest.dto.user.UserEditProfileDTO;
import com.Uniquest.UniQuest.dto.user.UserProfileAvatarDTO;
import com.Uniquest.UniQuest.dto.user.UserProfileDTO;
import com.Uniquest.UniQuest.infra.security.TokenService;
import com.Uniquest.UniQuest.repositories.UserRepository;
import com.Uniquest.UniQuest.service.EmailChangeService;
import com.Uniquest.UniQuest.service.ExamService;
import com.Uniquest.UniQuest.service.InteractionUserService;
import com.Uniquest.UniQuest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.Uniquest.UniQuest.service.PasswordResetService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final PasswordResetService passwordResetService;
    private final ExamService examService;
    private final InteractionUserService interactionUserService;
    private final EmailChangeService emailChangeService;


    @GetMapping
    public ResponseEntity<?> getUserInfo(@AuthenticationPrincipal User userPrincipal) {
        Optional<User> userOptional = repository.findById(userPrincipal.getId());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }
        User user = userOptional.get();

        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());
        return ResponseEntity.ok(userInfo);
    }


    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequestDTO body) {
        Optional<User> user = this.repository.findByEmail(body.email());

        if (user.isEmpty()) {
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


    @GetMapping("/profile")
    public UserProfileDTO getUserById(@AuthenticationPrincipal User userPrincipal) {
        return userService.getUserById(userPrincipal.getId());
    }

    //Endpoint para editar o perfil do usuário
    @PutMapping("/edit-profile")
    public ResponseEntity<User> updateUser(@AuthenticationPrincipal User userPrincipal, @RequestBody UserEditProfileDTO updateUserProfile) {
        User updatedUser = userService.updateUserProfile(userPrincipal.getId(), updateUserProfile);
        return ResponseEntity.ok(updatedUser);
    }

    // Endpoint para Adicionar o avatar do usuário
    @PutMapping("/avatar")
    public ResponseEntity<User> updateUserAvatar(
            @AuthenticationPrincipal User userPrincipal,
            @RequestParam("avatarFile") MultipartFile avatarFile
    ) {
        try {
            UserProfileAvatarDTO dto = new UserProfileAvatarDTO(avatarFile);
            User updatedUser = userService.updateUserAvatar(userPrincipal.getId(), dto);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Endpoint para deletar o avatar do usuário
    @DeleteMapping("/avatar")
    public ResponseEntity<Void> deleteUserAvatar(@AuthenticationPrincipal User userPrincipal) {
        try {
            userService.deleteUserAvatar(userPrincipal.getId());
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

    @GetMapping("/my-exams")
    public ResponseEntity<List<ExamListResponseDTO>> getUserExams(@AuthenticationPrincipal User userPrincipal) {
        List<Exam> exams = examService.getExamsByUser(userPrincipal.getId()); // Busca as provas do usuário

        List<ExamListResponseDTO> examDTOs = examService.convertExamsToDTOs(exams);

        return ResponseEntity.ok(examDTOs);
    }

    @GetMapping("my-liked-exams")
    public ResponseEntity<List<ExamListResponseDTO>> getLikedExams(@AuthenticationPrincipal User userPrincipal) {
        List<Exam> likedExams = interactionUserService.getExamsLikedByUser(userPrincipal.getId());

        List<ExamListResponseDTO> examDTOs = examService.convertExamsToDTOs(likedExams);

        return ResponseEntity.ok(examDTOs);

    }

    @GetMapping("/my-comments-exams")
    public ResponseEntity<List<ExamListResponseDTO>> getCommentedExams(@AuthenticationPrincipal User userPrincipal) {
        List<Exam> commentedExams = interactionUserService.getExamsCommentedByUser(userPrincipal.getId());

        List<ExamListResponseDTO> examDTOs = examService.convertExamsToDTOs(commentedExams);

        return ResponseEntity.ok(examDTOs);
    }

    // Endpoint para iniciar a solicitação de troca de e-mail
    @PostMapping("/request-change")
    public ResponseEntity<String> requestEmailChange(@RequestParam String currentEmail, @RequestParam String newEmail) {
        emailChangeService.createEmailChangeCode(currentEmail, newEmail);
        return ResponseEntity.ok("Código de troca de e-mail enviado com sucesso.");
    }


    // Endpoint para confirmar a troca de e-mail com o código
    @PostMapping("/confirm-change")
    public ResponseEntity<String> confirmEmailChange(@RequestParam String currentEmail, @RequestParam String code, @RequestParam String newEmail) {
        emailChangeService.confirmEmailChange(currentEmail, code, newEmail);
        return ResponseEntity.ok("E-mail alterado com sucesso.");
    }

}
