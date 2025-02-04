package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.user.InteractionUser;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.repositories.ExamRepository;
import com.Uniquest.UniQuest.repositories.InteractionUserRepository;
import com.Uniquest.UniQuest.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InteractionUserService {

    private final InteractionUserRepository interactionUserRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;


    @Transactional
    public String toggleLike(String userId, Long examId) {
        // Verificação de null ou vazio para userId e examId
        if (userId == null || userId.isEmpty()) {
            return "O userId não pode ser nulo ou vazio.";
        }
        if (examId == null) {
            return "O examId não pode ser nulo.";
        }

        // Busca o usuário e o exame no banco de dados
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Exam> examOpt = examRepository.findById(examId);

        // Verifica se o usuário e o exame existem
        if (userOpt.isEmpty() || examOpt.isEmpty()) {
            return "Usuário ou exame não encontrado.";
        }

        User user = userOpt.get();
        Exam exam = examOpt.get();

        // Verifica se já existe uma interação entre o usuário e o exame
        Optional<InteractionUser> interactionOpt = interactionUserRepository.findByUserAndExam(user, exam);

        if (interactionOpt.isPresent()) {
            // Se já existe uma interação, atualiza o status do "like"
            InteractionUser interaction = interactionOpt.get();
            if (interaction.isLiked()) {
                interaction.setLiked(false);
                exam.setLikesCount(exam.getLikesCount() - 1);
            } else {
                interaction.setLiked(true);
                exam.setLikesCount(exam.getLikesCount() + 1);
            }
            interactionUserRepository.save(interaction);  // Salva a interação atualizada
        } else {
            // Se não existe interação, cria uma nova
            InteractionUser newInteraction = new InteractionUser();
            newInteraction.setUser(user);
            newInteraction.setExam(exam);
            newInteraction.setLiked(true);  // Define que o usuário curtiu
            exam.setLikesCount(exam.getLikesCount() + 1);
            interactionUserRepository.save(newInteraction);  // Salva a nova interação
        }

        // Salva o exame com o número atualizado de likes
        examRepository.save(exam);

        return "Like atualizado com sucesso!";
    }
}


