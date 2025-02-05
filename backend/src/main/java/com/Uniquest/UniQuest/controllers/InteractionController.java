package com.Uniquest.UniQuest.controllers;

import com.Uniquest.UniQuest.domain.user.CommentUser;
import com.Uniquest.UniQuest.dto.CommentDTO;
import com.Uniquest.UniQuest.dto.CommentResponseDTO;
import com.Uniquest.UniQuest.dto.LikeDTO;
import com.Uniquest.UniQuest.service.InteractionUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/interaction")
@RequiredArgsConstructor
public class InteractionController {

    private final InteractionUserService interactionUserService;

    @PostMapping("/like")
    public ResponseEntity<String> likeExam(@RequestBody LikeDTO likeDTO) {
        System.out.println("DTO recebido: " + likeDTO);

        String userId = likeDTO.userId();
        Long examId = likeDTO.examID();

        if (examId == null) {
            return ResponseEntity.badRequest().body("O ID do exame não pode ser nulo.");
        }

        String response = interactionUserService.toggleLike(userId, examId);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/comment")
    public ResponseEntity<String> addComment(@RequestBody CommentDTO commentDTO) {
        try {
            interactionUserService.addComment(
                    commentDTO.userId(),
                    commentDTO.examId(),
                    commentDTO.text()
            );
            // Retorna uma mensagem de sucesso indicando que o comentário foi adicionado com sucesso.
            return ResponseEntity.ok("Comentário adicionado com sucesso.");
        } catch (Exception e) {
            // Se ocorrer algum erro, retorna uma mensagem de erro.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao adicionar comentário: " + e.getMessage());
        }
    }










}

