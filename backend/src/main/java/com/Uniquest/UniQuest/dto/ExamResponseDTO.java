package com.Uniquest.UniQuest.dto;

import java.util.List;

public record ExamResponseDTO(Long id, String title, String description, List<String> tags, String authorName) {
}
