package com.Uniquest.UniQuest.controllers;

import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.user.EmailChangeCode;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.auth.RegisterRequestDTO;
import com.Uniquest.UniQuest.dto.common.ResponseDTO;
import com.Uniquest.UniQuest.dto.exam.ExamListResponseDTO;
import com.Uniquest.UniQuest.dto.user.*;
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
    public ResponseEntity<String> updateUserAvatar(
            @AuthenticationPrincipal User userPrincipal,
            @RequestParam("avatarFile") MultipartFile avatarFile
    ) {
        try {
            UserProfileAvatarDTO dto = new UserProfileAvatarDTO(avatarFile);
            userService.updateUserAvatar(userPrincipal.getId(), dto);
            return ResponseEntity.ok("Avatar atualizado");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar o avatar");
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
        String userId = userPrincipal.getId(); // Agora garantindo que é String
        List<Exam> exams = examService.getExamsByUser(userId); // Busca as provas do usuário

        List<ExamListResponseDTO> examDTOs = examService.convertExamsToDTOs(exams, userId);

        return ResponseEntity.ok(examDTOs);
    }

    @GetMapping("my-liked-exams")
    public ResponseEntity<List<ExamListResponseDTO>> getLikedExams(@AuthenticationPrincipal User userPrincipal) {
        String userId = userPrincipal.getId();
        List<Exam> likedExams = interactionUserService.getExamsLikedByUser(userId);

        List<ExamListResponseDTO> examDTOs = examService.convertExamsToDTOs(likedExams, userId);

        return ResponseEntity.ok(examDTOs);
    }

    @GetMapping("/my-comments-exams")
    public ResponseEntity<List<ExamListResponseDTO>> getCommentedExams(@AuthenticationPrincipal User userPrincipal) {
        String userId = userPrincipal.getId();
        List<Exam> commentedExams = interactionUserService.getExamsCommentedByUser(userId);

        List<ExamListResponseDTO> examDTOs = examService.convertExamsToDTOs(commentedExams, userId);

        return ResponseEntity.ok(examDTOs);
    }


    // Endpoint para iniciar a solicitação de troca de e-mail
    @PostMapping("/request-change")
    public ResponseEntity<Map<String, String>> requestEmailChange(@RequestBody EmailChangeRequestDTO request) {
        emailChangeService.createEmailChangeCode(request.currentEmail() , request.newEmail());
        Map<String, String> response = new HashMap<>();
        response.put("message", "E-mail enviado com sucesso");
        return ResponseEntity.ok(response);
    }

    // Endpoint para confirmar a troca
    @PostMapping("/confirm-change")
    public ResponseEntity<Map<String, String>> confirmEmailChange(@RequestBody ConfirmEmailChangeDTO request) {
        emailChangeService.confirmEmailChange(request.currentEmail(), request.code(), request.newEmail());
        Map<String, String> response = new HashMap<>();
        response.put("message", "E-mail alterado com sucesso.");
        return ResponseEntity.ok(response);
    }
}
