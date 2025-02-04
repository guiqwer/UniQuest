package com.Uniquest.UniQuest.repositories;

import com.Uniquest.UniQuest.domain.exam.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    // Buscar exames por título
    List<Exam> findByTitleContainingIgnoreCase(String title);

    // Buscar exames por autor
    List<Exam> findByAuthorId(String authorId);
}
