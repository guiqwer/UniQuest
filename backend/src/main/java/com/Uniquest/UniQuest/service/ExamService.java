package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.ai.service.GroqChatService;
import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.exam.ExamImage;
import com.Uniquest.UniQuest.domain.exam.ExamPdf;
import com.Uniquest.UniQuest.domain.exam.ExamText;
import com.Uniquest.UniQuest.domain.question.DiscursiveQuestion;
import com.Uniquest.UniQuest.domain.question.ObjectiveQuestion;
import com.Uniquest.UniQuest.domain.question.Question;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.*;
import com.Uniquest.UniQuest.exceptions.ServerErrorException;
import com.Uniquest.UniQuest.repositories.ExamCustomRepository;
import com.Uniquest.UniQuest.repositories.ExamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ExamService {


    private final ExamRepository examRepository;
    private final ExamCustomRepository examCustomRepository;
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

    public Long uploadTextExam(String title, String description, List<String> tags,
                               List<QuestionDTO> questionsDTO, User loggedUser) {
        Exam savedExam = this.addExam(title, description, tags, questionsDTO, loggedUser);
        return savedExam.getId();
    }


    public Long generateTextExam(Long id){
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


        Exam savedExam = this.addExam(
                foundExam.getTitle() + " - IA GENERATED",
                foundExam.getDescription() + " - IA GENERATED BY UniQuest™",
                filteredTags,
                questionsGenerated,
                foundExam.getAuthor()
        );

        return savedExam.getId();
    }

    private ExamText addExam(String title, String description, List<String> tags, List<QuestionDTO> questionsDTO
                            , User loggedUser) {
        ExamText examText = new ExamText();
        examText.setTitle(title);
        examText.setDescription(description);
        examText.setTags(tags);
        examText.setAuthor(loggedUser);
        examText.setTotalQuestions(questionsDTO.size());

        /// Converta cada QuestionDTO para ObjectiveQuestion (subclasse de Question)
        List<Question> objectiveQuestions = questionsDTO.stream()
                .map(dto -> convertToQuestion(dto, examText))
                .toList();
        List<Question> questions = new ArrayList<>(objectiveQuestions);
        examText.setQuestions(questions);

        return examRepository.save(examText);
    }
    private String getTypeExam(Exam exam){
        String type = "";
        if (exam instanceof ExamText){
            type = "text";
        } else if (exam instanceof ExamPdf){
            type = "pdf";
        } else if (exam instanceof ExamImage){
            type = "image";
        }
        return type;
    }
    public List<ExamListResponseDTO> convertExamsToDTOs(List<Exam> exams) {
        return exams.stream().map(exam -> {
            List<CommentResponseDTO> comments = interactionUserService.getCommentsByExam(exam.getId()); // Busca os comentários
            String typeExam = getTypeExam(exam);

            Object examData = null;
            
            if (exam instanceof ExamText) {
                examData = exam;
            } else if (exam instanceof ExamImage) {
                ExamImage examImage = (ExamImage) exam;
                if (examImage.getImageData() != null) {
                    examData = Base64.getEncoder().encodeToString(examImage.getImageData());
                }
            } else if (exam instanceof ExamPdf) {
                ExamPdf examPdf = (ExamPdf) exam;
                if (examPdf.getPdfData() != null) {
                    examData = Base64.getEncoder().encodeToString(examPdf.getPdfData());
                }
            }
            return new ExamListResponseDTO(
                    exam.getId(),
                    exam.getTitle(),
                    exam.getDescription(),
                    exam.getTags(),
                    exam.getAuthor() != null ? exam.getAuthor().getName() : null, // Adicionando o nome do autor
                    exam.getLikesCount(),
                    comments,
                    typeExam,
                    examData
            );
        }).collect(Collectors.toList());
    }

//    private ObjectiveQuestion convertToQuestion(QuestionDTO dto, ExamText examText) {
//        ObjectiveQuestion question = new ObjectiveQuestion();
//        question.setStatement(dto.statement());
//        question.setOrder(dto.order());
//        String optionsString = dto.options().entrySet()
//                .stream()
//                .map(entry -> entry.getKey() + " : " + entry.getValue())
//                .collect(Collectors.joining(", "));
//        List<String> optionsList = new ArrayList<>(List.of(optionsString.split(", ")));
//        List<String> correctAnswerList = dto.correctAnswer() != null
//                ? new ArrayList<>(dto.correctAnswer().values())
//                : new ArrayList<>();
//        question.setOptions(optionsList);
//        question.setCorrectAnswer(correctAnswerList);
//        question.setExamText(examText);
//        return question;
//    }

//    private Question convertToQuestion(QuestionDTO dto, ExamText examText) {
//        Question question;
//
//        if ("OBJECTIVE".equalsIgnoreCase(dto.type())) {
//            ObjectiveQuestion objQuestion = new ObjectiveQuestion();
//            objQuestion.setOptions(dto.options() != null ? List.copyOf(dto.options().keySet()) : List.of());
//            objQuestion.setCorrectAnswer(dto.correctAnswer() != null ? List.copyOf(dto.correctAnswer().keySet()) : List.of());
//            question = objQuestion;
//
//
//        } else if ("DISCURSIVE".equalsIgnoreCase(dto.type())) {
//            DiscursiveQuestion discursiveQuestion = new DiscursiveQuestion();
//            discursiveQuestion.setExpectedAnswer(dto.correctAnswer() != null ? dto.correctAnswer().values().stream().findFirst().orElse("") : "");
//            question = discursiveQuestion;
//        } else {
//            throw new IllegalArgumentException("Tipo de questão inválido: " + dto.type());
//        }
//
//        question.setStatement(dto.statement());
//        question.setOrder(dto.order());
//        question.setExamText(examText);
//
//        return question;
//    }


    // Essa definitivamente não é a melhor maneira de implementar isso mas vai ser o que temos por agora.
    // Não mude essa função em hipótese alguma!!!!
    // Essa função irá adicionar a resposta correta de questões objetivas e discursivas da maneira que o front espera.
    // Além de cadastrar as respostas para cada tipo de questão.
    private Question convertToQuestion(QuestionDTO dto, ExamText examText) {
        if (dto.type() == null || "OBJECTIVE".equalsIgnoreCase(dto.type())) {
            ObjectiveQuestion objQuestion = new ObjectiveQuestion();

            // Validação explícita do Map para options e correctAnswer
            if (dto.options() == null) {
                throw new IllegalArgumentException("Opções não podem ser nulas para questões objetivas");
            }

            String optionsString = dto.options().entrySet().stream()
                    .map(entry -> entry.getKey() + " : " + entry.getValue())
                    .collect(Collectors.joining(", "));
            List<String> optionsList = new ArrayList<>(List.of(optionsString.split(", ")));



            objQuestion.setCorrectAnswer((String) dto.correctAnswer());

            objQuestion.setStatement(dto.statement());
            objQuestion.setOrder(dto.order());
            objQuestion.setExamText(examText);
            objQuestion.setOptions(optionsList);

            return objQuestion;


        } else if ("DISCURSIVE".equalsIgnoreCase(dto.type())) {
            DiscursiveQuestion discursiveQuestion = new DiscursiveQuestion();

            // Valida se o correctAnswer é uma String
            if (!(dto.correctAnswer() instanceof String)) {
                throw new IllegalArgumentException("Resposta correta inválida para questão discursiva: esperado uma String");
            }
            String expectedAnswer = (String) dto.correctAnswer();
            discursiveQuestion.setExpectedAnswer(expectedAnswer != null ? expectedAnswer : "");

            discursiveQuestion.setStatement(dto.statement());
            discursiveQuestion.setOrder(dto.order());
            discursiveQuestion.setExamText(examText);
            return discursiveQuestion;

        } else {
            throw new IllegalArgumentException("Tipo de questão inválido: " + dto.type());
        }
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

    
    public List<Exam> getAllExamsWithFilters(ExamListRequestDTO request) {
        return examCustomRepository.findByFilters(
                request.getTitle(),
                request.getDescription(),
                request.getTags()
        );
    }
}
