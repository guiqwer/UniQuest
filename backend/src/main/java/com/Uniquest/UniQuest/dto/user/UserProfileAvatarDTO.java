package com.Uniquest.UniQuest.dto.user;

import org.springframework.web.multipart.MultipartFile;

public record UserProfileAvatarDTO(MultipartFile avatarFile) {
}
