package com.Uniquest.UniQuest.repositories;

import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    // Buscar exames por título
    List<Exam> findByTitleContainingIgnoreCase(String title);

    // Buscar exames por autor
    List<Exam> findByAuthorId(String authorId);

    // Deve-se adicinar findById aqui?
}
