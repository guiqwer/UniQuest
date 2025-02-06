package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.exam.ExamImage;
import com.Uniquest.UniQuest.domain.exam.ExamPdf;
import com.Uniquest.UniQuest.domain.exam.ExamText;
import com.Uniquest.UniQuest.domain.question.ObjectiveQuestion;
import com.Uniquest.UniQuest.domain.question.Question;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.CommentResponseDTO;
import com.Uniquest.UniQuest.dto.ExamResponseDTO;
import com.Uniquest.UniQuest.dto.QuestionDTO;
import com.Uniquest.UniQuest.repositories.ExamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final InteractionUserService interactionUserService;


    public void uploadImageExam(String title, String description, List<String> tags, MultipartFile file, User loggedUser) throws IOException {
        ExamImage examImage = new ExamImage();
        examImage.setTitle(title);
        examImage.setDescription(description);
        examImage.setTags(tags); // Define as tags
        examImage.setAuthor(loggedUser); // Define o autor como o usuário logado
        examImage.setImageData(file.getBytes()); // Salva os dados da imagem

        examRepository.save(examImage); // Salva a prova no banco
    }

    public void uploadPDFExam(String title, String description, List<String> tags, MultipartFile file, User loggedUser) throws IOException {
        ExamPdf examPdf = new ExamPdf();
        examPdf.setTitle(title);
        examPdf.setDescription(description);
        examPdf.setTags(tags); // Define as tags
        examPdf.setAuthor(loggedUser); // Define o autor como o usuário logado
        examPdf.setPdfData(file.getBytes()); // Salva os dados do PDF

        examRepository.save(examPdf); // Salva a prova no banco
    }

    public void uploadTextExam(String title, String description, List<String> tags,
                               List<QuestionDTO> questions, User loggedUser) {
        System.out.println("Passou aqui");
        ExamText examText = new ExamText();
        examText.setTitle(title);
        examText.setDescription(description);
        examText.setTags(tags);
        examText.setAuthor(loggedUser);
        examText.setTotalQuestions(questions.size());

        List<Question> questionList = questions.stream().map(q -> {
            ObjectiveQuestion objQuestion = new ObjectiveQuestion();
            objQuestion.setStatement(q.getStatement());
            objQuestion.setOrder(q.getQuestion());
            objQuestion.setExamText(examText);

            // Processar opções mantendo a ordem original
            List<String> formattedOptions = q.getOptions().stream()
                    .map(opcao -> {
                        // Remove qualquer formatação numérica existente
                        String cleanOption = opcao.replaceFirst("^\\d+[\\.\\s]*", "");
                        return cleanOption;
                    })
                    .collect(Collectors.toList());

            objQuestion.setOptions(formattedOptions);
            return objQuestion;
        }).collect(Collectors.toList());

        examText.setQuestions(questionList);
        examRepository.save(examText);
    }

    public List<ExamResponseDTO> convertExamsToDTOs(List<Exam> exams) {
        return exams.stream().map(exam -> {
            List<CommentResponseDTO> comments = interactionUserService.getCommentsByExam(exam.getId()); // Busca os comentários

            return new ExamResponseDTO(
                    exam.getId(),
                    exam.getTitle(),
                    exam.getDescription(),
                    exam.getTags(),
                    exam.getAuthor() != null ? exam.getAuthor().getName() : null, // Adicionando o nome do autor
                    exam.getLikesCount(),
                    comments
            );
        }).collect(Collectors.toList());
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll(); // Busca todas as provas
    }

    // Pegar todas as provas de um usuário
    public List<Exam> getExamsByUser(String userId){
        return examRepository.findByAuthorId(userId);
    }

}
