package com.Uniquest.UniQuest.repositories;

import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.user.LikeUser;
import com.Uniquest.UniQuest.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LikeUserRepository extends JpaRepository<LikeUser, Long> {
    Optional<LikeUser> findByUserAndExam(User user, Exam exam); // Verifica se o usuário já interagiu com a prova
    List<LikeUser> findByUserAndLikedTrue(User user);
    @Query("SELECT COUNT(l) > 0 FROM LikeUser l WHERE l.user.id = :userId AND l.exam.id = :examId AND l.liked = true")
    boolean hasUserLikedExam(@Param("userId") String userId, @Param("examId") Long examId);
    @Query("SELECT COUNT(l) FROM LikeUser l WHERE l.exam.id = :examId AND l.liked = true")
    long countByExamAndLikedTrue(@Param("examId") Long examId);


}
