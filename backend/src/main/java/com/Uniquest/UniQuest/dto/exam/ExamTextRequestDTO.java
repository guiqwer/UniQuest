package com.Uniquest.UniQuest.dto.exam;

import com.Uniquest.UniQuest.dto.question.QuestionDTO;
import lombok.Data;
import java.util.List;

@Data
public class ExamTextRequestDTO {
    private String title;
    private String description;
    private List<String> tags;
    private List<QuestionDTO> text; // Para o formato atual (única questão)
}
