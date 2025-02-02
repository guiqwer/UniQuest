package com.Uniquest.UniQuest.repositories;

import com.Uniquest.UniQuest.domain.user.PasswordResetCode;
import com.Uniquest.UniQuest.domain.user.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetCodeRepository extends JpaRepository<PasswordResetCode, Long> {
    Optional<PasswordResetCode> findByResetCode(String resetCode);
}
