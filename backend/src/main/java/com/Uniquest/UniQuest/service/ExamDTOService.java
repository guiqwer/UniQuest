package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.dto.CommentResponseDTO;
import com.Uniquest.UniQuest.dto.ExamResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamDTOService {

    private final InteractionUserService interactionUserService;


    public List<ExamResponseDTO> convertExamsToDTOs(List<Exam> exams) {
        return exams.stream().map(exam -> {
            List<CommentResponseDTO> comments = interactionUserService.getCommentsByExam(exam.getId()); // Busca os comentários

            return new ExamResponseDTO(
                    exam.getId(),
                    exam.getTitle(),
                    exam.getDescription(),
                    exam.getTags(),
                    exam.getAuthor() != null ? exam.getAuthor().getName() : null, // Adicionando o nome do autor
                    exam.getLikesCount(),
                    comments
            );
        }).collect(Collectors.toList());
    }
}
