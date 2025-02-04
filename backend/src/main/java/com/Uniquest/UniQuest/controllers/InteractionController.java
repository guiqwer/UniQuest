package com.Uniquest.UniQuest.controllers;

import com.Uniquest.UniQuest.dto.LikeDTO;
import com.Uniquest.UniQuest.service.InteractionUserService;
import lombok.RequiredArgsConstructor;
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


}

