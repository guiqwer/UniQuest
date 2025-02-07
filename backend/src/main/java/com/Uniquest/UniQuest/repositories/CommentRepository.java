package com.Uniquest.UniQuest.repositories;

import com.Uniquest.UniQuest.domain.user.CommentUser; // Import corrigido
import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<CommentUser, Long> { // Use CommentUser aqui
    // Busca todos os comentários de um exame
    List<CommentUser> findByExam(Exam exam);

    List<CommentUser> findByUser(User user); // Buscar todos os comentários feitos por um usuário
}