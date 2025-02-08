package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.ai.service.GroqChatService;
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
import com.Uniquest.UniQuest.dto.QuestionResponseDTO;
import com.Uniquest.UniQuest.exceptions.ServerErrorException;
import com.Uniquest.UniQuest.repositories.ExamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;


@Service
@RequiredArgsConstructor
public class ExamService {


    private final ExamRepository examRepository;
    private final InteractionUserService interactionUserService;
    private final GroqChatService groqChatService;


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
                               List<QuestionDTO> questionsDTO, User loggedUser) {
        this.addExam(title, description, tags, questionsDTO, loggedUser);
    }


    public void generateTextExam(Long id){
        Optional<Exam> examOptional = examRepository.findById(id);
        if (examOptional.isEmpty()) {
            throw new ServerErrorException("Exam not found");
        }

        Exam foundExam = examOptional.get();
        List<String> tags = foundExam.getTags();  // Pegando as tags do exame

        if (tags == null || tags.isEmpty()) {
            throw new ServerErrorException("Exam has no tags to generate questions.");
        }

        // Filtrando tags
        List<String> filteredTags = groqChatService.handleTagsForPrompt(tags);
        if (filteredTags.isEmpty()) {
            throw new ServerErrorException("No relevant tags found for question generation.");
        }

        int numQuestions = 3;

        // Gerando questões
        List<QuestionDTO> questionsGenerated = groqChatService.generateTest(filteredTags, numQuestions);
        System.out.println(questionsGenerated);


        this.addExam(foundExam.getTitle() + " - IA GENERATED", foundExam.getDescription() + " - IA GENERATED BY UniQuest™", filteredTags,
                questionsGenerated, foundExam.getAuthor());
    }

    private void addExam(String title, String description, List<String> tags, List<QuestionDTO> questionsDTO
                            , User loggedUser) {
        ExamText examText = new ExamText();
        examText.setTitle(title);
        examText.setDescription(description);
        examText.setTags(tags);
        examText.setAuthor(loggedUser);
        examText.setTotalQuestions(questionsDTO.size());

        /// Converta cada QuestionDTO para ObjectiveQuestion (subclasse de Question)
        List<ObjectiveQuestion> objectiveQuestions = questionsDTO.stream()
                .map(dto -> convertToQuestion(dto, examText))
                .toList();
        List<Question> questions = new ArrayList<>(objectiveQuestions);
        examText.setQuestions(questions);

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

    private ObjectiveQuestion convertToQuestion(QuestionDTO dto, ExamText examText) {
        ObjectiveQuestion question = new ObjectiveQuestion();
        question.setStatement(dto.statement());
        question.setOrder(dto.order());
        String optionsString = dto.options().entrySet()
                .stream()
                .map(entry -> entry.getKey() + " : " + entry.getValue())
                .collect(Collectors.joining(", "));
        List<String> optionsList = new ArrayList<>(List.of(optionsString.split(", ")));
        List<String> correctAnswerList = dto.correctAnswer() != null
                ? new ArrayList<>(dto.correctAnswer().values())
                : new ArrayList<>();
        question.setOptions(optionsList);
        question.setCorrectAnswer(correctAnswerList);
        question.setExamText(examText);
        return question;
    }

    public Optional<Exam> getTextExam(Long id) {
        return examRepository.findById(id).map(exam -> (ExamImage) exam);
    }
    public Optional<ExamImage> getImageExam(Long id) {
        return examRepository.findById(id).map(exam -> (ExamImage) exam);
    }


    public List<Exam> getAllExams() {
        return examRepository.findAll(); // Busca todas as provas
    }

    // Pegar todas as provas de um usuário
    public List<Exam> getExamsByUser(String userId){
        return examRepository.findByAuthorId(userId);
    }


}
