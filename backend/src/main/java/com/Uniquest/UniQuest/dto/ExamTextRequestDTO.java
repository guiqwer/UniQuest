package com.Uniquest.UniQuest.dto;

import lombok.Data;
import java.util.List;

@Data
public class ExamTextRequestDTO {
    private String title;
    private String description;
    private List<String> tags;
    private QuestionDTO text; // Para o formato atual (única questão)
}
