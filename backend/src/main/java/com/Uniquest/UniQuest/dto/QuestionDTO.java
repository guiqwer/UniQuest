package com.Uniquest.UniQuest.dto;

import com.Uniquest.UniQuest.exceptions.ServerErrorException;
import jakarta.annotation.Nullable;
import lombok.Data;

import java.io.IOException;
import java.util.List;
import java.util.Map;


public record QuestionDTO(Integer order, @Nullable String type, String statement, @Nullable Map<String, String> options, @Nullable String correctAnswer) {
}
