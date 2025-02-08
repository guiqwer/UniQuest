package com.Uniquest.UniQuest.repositories;

import com.Uniquest.UniQuest.domain.user.EmailChangeCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailChangeCodeRepository extends JpaRepository<EmailChangeCode, Long> {
    Optional<EmailChangeCode> findByCode(String code);
}

