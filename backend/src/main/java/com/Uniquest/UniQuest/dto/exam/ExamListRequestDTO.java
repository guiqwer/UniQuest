package com.Uniquest.UniQuest.dto.exam;

import lombok.Data;

import java.util.List;

@Data
public class ExamListRequestDTO {
    private String title;
    private String description;
    private List<String> tags;
}
