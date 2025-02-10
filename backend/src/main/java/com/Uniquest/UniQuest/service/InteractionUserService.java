package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.user.CommentUser;
import com.Uniquest.UniQuest.domain.user.LikeUser;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.comment.CommentResponseDTO;
import com.Uniquest.UniQuest.exceptions.InvalidInputException;
import com.Uniquest.UniQuest.exceptions.ExamNotFoundException;
import com.Uniquest.UniQuest.exceptions.UserNotFoundException;
import com.Uniquest.UniQuest.repositories.CommentRepository;
import com.Uniquest.UniQuest.repositories.ExamRepository;
import com.Uniquest.UniQuest.repositories.LikeUserRepository;
import com.Uniquest.UniQuest.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InteractionUserService {

    private final LikeUserRepository likeUserRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final CommentRepository commentRepository;

    @Transactional
    public String toggleLike(String userId, Long examId) {
        if (userId == null || userId.isEmpty()) {
            throw new InvalidInputException("O userId não pode ser nulo ou vazio.");
        }
        if (examId == null) {
            throw new InvalidInputException("O examId não pode ser nulo.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado."));
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ExamNotFoundException("Exame não encontrado."));

        Optional<LikeUser> interactionOpt = likeUserRepository.findByUserAndExam(user, exam);

        if (interactionOpt.isPresent()) {
            LikeUser interaction = interactionOpt.get();
            if (interaction.isLiked()) {
                interaction.setLiked(false);
                exam.setLikesCount(exam.getLikesCount() - 1);
            } else {
                interaction.setLiked(true);
                exam.setLikesCount(exam.getLikesCount() + 1);
            }
            likeUserRepository.save(interaction);
        } else {
            LikeUser newInteraction = new LikeUser();
            newInteraction.setUser(user);
            newInteraction.setExam(exam);
            newInteraction.setLiked(true);
            exam.setLikesCount(exam.getLikesCount() + 1);
            likeUserRepository.save(newInteraction);
        }

        examRepository.save(exam);
        return "Like atualizado com sucesso!";
    }


    @Transactional
    public CommentUser addComment(String userId, Long examId, String text) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado."));
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ExamNotFoundException("Exame não encontrado."));

        CommentUser commentUser = new CommentUser();
        commentUser.setUser(user);
        commentUser.setExam(exam);
        commentUser.setText(text);

        return commentRepository.save(commentUser);
    }

    /*
    // *************TESTE******************
    // Editar um comentário
    @Transactional
    public Comment editComment(Long commentId, String newText) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comentário não encontrado"));
        comment.setText(newText);
        return commentRepository.save(comment);
    }

    // Excluir um comentário
    @Transactional
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    // Listar todos os comentários de um exame
    public List<Comment> getCommentsByExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exame não encontrado"));
        return commentRepository.findByExam(exam);
    }

     */

    public List<Exam> getExamsLikedByUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado."));

        List<LikeUser> likes = likeUserRepository.findByUserAndLikedTrue(user);

        return likes.stream().map(LikeUser::getExam)
                .collect(Collectors.toList());
    }

    public List<Exam> getExamsCommentedByUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado."));

        List<CommentUser> comments = commentRepository.findByUser(user);

        return comments.stream()
                .map(CommentUser::getExam)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<CommentResponseDTO> getCommentsByExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ExamNotFoundException("Exame não encontrado."));

        List<CommentUser> comments = commentRepository.findByExam(exam);

        return comments.stream()
                .map(comment -> new CommentResponseDTO(
                        comment.getId(),
                        comment.getUser().getName(),  // Obtém o nome do usuário que fez o comentário
                        comment.getText()
                ))
                .collect(Collectors.toList());
    }
}





