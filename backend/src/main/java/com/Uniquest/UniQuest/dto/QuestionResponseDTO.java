package com.Uniquest.UniQuest.dto;

import lombok.Data;

import java.util.List;

public record QuestionResponseDTO(Integer question, String statement, List<String> options) {
}
