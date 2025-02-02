package com.Uniquest.UniQuest.controllers;

import com.Uniquest.UniQuest.domain.user.PasswordResetCode;
import com.Uniquest.UniQuest.services.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
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
