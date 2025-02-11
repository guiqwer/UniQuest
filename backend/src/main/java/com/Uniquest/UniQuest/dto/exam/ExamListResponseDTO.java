package com.Uniquest.UniQuest.dto.exam;

import com.Uniquest.UniQuest.dto.comment.CommentResponseDTO;

import java.util.List;

public record ExamListResponseDTO(Long id, String title, String description, List<String> tags,
                                  String authorName, int likesCount, List<CommentResponseDTO> comments, String type, boolean itsLiked, String avatarUser, Object data) {
}
