package com.Uniquest.UniQuest.dto.question;

import java.util.List;

public record QuestionResponseDTO(Integer question, String statement, List<String> options) {
}
