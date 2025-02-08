package com.Uniquest.UniQuest.repositories;

import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.user.LikeUser;
import com.Uniquest.UniQuest.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    // Buscar exames por título
    List<Exam> findByTitleContainingIgnoreCase(String title);

    // Buscar exames por autor
    List<Exam> findByAuthorId(String authorId);

    @Query("SELECT e FROM Exam e " +
            "WHERE (:title IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
            "AND (:description IS NULL OR LOWER(e.description) LIKE LOWER(CONCAT('%', :description, '%')))")
    List<Exam> findByFilters(@Param("title") String title,
                             @Param("description") String description);
}
