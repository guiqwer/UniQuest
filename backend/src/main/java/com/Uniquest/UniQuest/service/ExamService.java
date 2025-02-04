package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.ai.service.GroqChatService;
import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.exam.ExamImage;
import com.Uniquest.UniQuest.domain.exam.ExamPdf;
import com.Uniquest.UniQuest.domain.exam.ExamText;
import com.Uniquest.UniQuest.domain.question.ObjectiveQuestion;
import com.Uniquest.UniQuest.domain.question.Question;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.QuestionDTO;
import com.Uniquest.UniQuest.dto.QuestionResponseDTO;
import com.Uniquest.UniQuest.exceptions.ServerErrorException;
import com.Uniquest.UniQuest.repositories.ExamRepository;
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
public class ExamService {


    private final ExamRepository examRepository;
    private final GroqChatService groqChatService;

    @Autowired
    public ExamService(ExamRepository examRepository, GroqChatService groqChatService) {
        this.examRepository = examRepository;
        this.groqChatService = groqChatService;
    }

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

    private ObjectiveQuestion convertToQuestion(QuestionDTO dto, ExamText examText) {
        ObjectiveQuestion question = new ObjectiveQuestion();
        question.setStatement(dto.statement());
        question.setOrder(dto.order());
        List<String> optionsList = new ArrayList<>(dto.options().values());
        question.setOptions(optionsList);
        question.setExamText(examText);
        return question;
    }

//    public void generateTextExam(Long id){
//        Optional<Exam> examOptional = examRepository.findById(id);
//        if (examOptional.isEmpty()) {
//            throw new ServerErrorException("Exam not found");
//        }
//
//        Exam foundExam = examOptional.get();
//        List<String> tags = foundExam.getTags();  // Pegando as tags do exame
//
//        if (tags == null || tags.isEmpty()) {
//            throw new ServerErrorException("Exam has no tags to generate questions.");
//        }
//
//        // Filtrando tags
//        List<String> filteredTags = groqChatService.handleTagsForPrompt(tags);
//        if (filteredTags.isEmpty()) {
//            throw new ServerErrorException("No relevant tags found for question generation.");
//        }
//
//        int numQuestions = 5;
//
//        // Gerando questões
//        String jsonResponse = groqChatService.generateTest(filteredTags, numQuestions);
//        System.out.println(jsonResponse);
//        // Converter JSON para List<QuestionDTO> (assumindo que exista um método para isso)
//        List<QuestionDTO> questions = parseJsonToQuestionDTO(jsonResponse);
//
//        // Criando e salvando um novo ExamText
//        ExamText examText = new ExamText();
//        examText.setTitle(foundExam.getTitle());
//        examText.setDescription(foundExam.getDescription());
//        examText.setTags(filteredTags);
//        examText.setAuthor(foundExam.getAuthor());
//        examText.setTotalQuestions(questions.size());
//        examText.setQuestions(questions);
//
//        List<Question> questionList = questions.stream().map(q -> {
//            ObjectiveQuestion objQuestion = new ObjectiveQuestion();
//            objQuestion.setStatement(q.getStatement());
//            objQuestion.setOrder(q.getQuestion());
//            objQuestion.setExamText(examText);
//
//            // Extrai as opções ordenadas (a, b, c, d)
//            List<String> formattedOptions = q.getOptions().entrySet().stream()
//                    .sorted(Map.Entry.comparingByKey())
//                    .map(Map.Entry::getValue)
//                    .collect(Collectors.toList());
//
//            objQuestion.setOptions(formattedOptions);
//            return objQuestion;
//        }).collect(Collectors.toList());
//
//        examText.setQuestions(questionList);
//        examRepository.save(examText);
//    }

    /**
     * Método que converte o JSON retornado pelo GroqChatService para uma lista de QuestionDTO.
     * O JSON esperado possui o seguinte formato:
     *
     * [
     *   {
     *     "question": <número sequencial>,
     *     "statement": "<enunciado>",
     *     "options": [
     *       {
     *         "a": "<primeira opcao>",
     *         "b": "<segunda opcao>",
     *         "c": "<terceira opcao>",
     *         "d": "<quarta opcao>"
     *       }
     *     ]
     *   },
     *   ...
     * ]
     */
    private List<QuestionDTO> parseJsonToQuestionDTO(String jsonResponse) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(jsonResponse, new TypeReference<List<QuestionDTO>>() {});
        } catch (IOException e) {
            throw new ServerErrorException("Erro ao converter o JSON para QuestionDTO", e);
        }
    }


    public Optional<Exam> getTextExam(Long id) {
        return examRepository.findById(id).map(exam -> (ExamImage) exam);
    }
    public Optional<ExamImage> getImageExam(Long id) {
        return examRepository.findById(id).map(exam -> (ExamImage) exam);
    }

    public Optional<ExamPdf> getPDFExam(Long id) {
        return examRepository.findById(id).map(exam -> (ExamPdf) exam);
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll(); // Busca todas as provas
    }
}
