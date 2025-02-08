package com.Uniquest.UniQuest.dto;

import com.Uniquest.UniQuest.domain.exam.Exam;

import java.util.List;

public record ExamListResponseDTO(Long id, String title, String description, List<String> tags,
                                  String authorName, int likesCount, List<CommentResponseDTO> comments, String type, Object data) {
}
