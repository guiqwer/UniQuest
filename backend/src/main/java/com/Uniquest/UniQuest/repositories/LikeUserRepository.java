package com.Uniquest.UniQuest.repositories;

import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.user.InteractionUser;
import com.Uniquest.UniQuest.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InteractionUserRepository extends JpaRepository<InteractionUser, Long> {
    Optional<InteractionUser> findByUserAndExam(User user, Exam exam); // Verifica se o usuário já interagiu com a prova
}
