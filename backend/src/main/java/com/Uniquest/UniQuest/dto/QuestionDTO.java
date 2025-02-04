package com.Uniquest.UniQuest.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionDTO {
    private Integer question;
    private String statement;
    private List<String> options;
}
