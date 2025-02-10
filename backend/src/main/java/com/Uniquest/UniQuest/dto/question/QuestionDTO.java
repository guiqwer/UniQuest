package com.Uniquest.UniQuest.dto.question;

import jakarta.annotation.Nullable;

import java.util.Map;


public record QuestionDTO(Integer order, @Nullable String type, String statement, @Nullable Map<String, String> options, @Nullable String correctAnswer) {
}
