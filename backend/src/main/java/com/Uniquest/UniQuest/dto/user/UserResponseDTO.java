package com.Uniquest.UniQuest.dto.user;

import com.Uniquest.UniQuest.domain.user.User;

public record UserResponseDTO(
        String id,
        String name,
        String email,
        String username,
        String education,
        String areaOfInterest,
        String favoriteSubject,
        byte[] avatar
) {
    public static UserResponseDTO from(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getUsername(),
                user.getEducation(),
                user.getAreaOfInterest(),
                user.getFavoriteSubject(),
                user.getAvatar()
        );
    }
}
