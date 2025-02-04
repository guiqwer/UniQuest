package com.Uniquest.UniQuest.controllers;

import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.exam.ExamImage;
import com.Uniquest.UniQuest.domain.exam.ExamPdf;
import com.Uniquest.UniQuest.domain.exam.ExamText;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.ExamResponseDTO;
import com.Uniquest.UniQuest.dto.ExamTextRequestDTO;
import com.Uniquest.UniQuest.dto.QuestionDTO;
import com.Uniquest.UniQuest.service.ExamService;
import com.Uniquest.UniQuest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.Uniquest.UniQuest.repositories.ExamRepository;


import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/exam")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;
    private final ExamRepository examRepository;


    @PostMapping("/upload/image")
    public ResponseEntity<String> uploadImageExam(@RequestParam String title,
                                                  @RequestParam String description,
                                                  @RequestParam List<String> tags, // Adiciona a lista de tags
                                                  @RequestParam("file") MultipartFile file,
                                                  @AuthenticationPrincipal User loggedUser) { // Recebe o usuário logado
        try {
            examService.uploadImageExam(title, description, tags, file, loggedUser);
            return ResponseEntity.ok("Imagem enviada com sucesso!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao fazer upload da imagem.");
        }
    }

    @PostMapping("/upload/pdf")
    public ResponseEntity<String> uploadPDFExam(@RequestParam String title,
                                                @RequestParam String description,
                                                @RequestParam List<String> tags, // Adiciona a lista de tags
                                                @RequestParam("file") MultipartFile file,
                                                @AuthenticationPrincipal User loggedUser) { // Recebe o usuário logado
        try {
            examService.uploadPDFExam(title, description, tags, file, loggedUser);
            return ResponseEntity.ok("PDF enviado com sucesso!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao fazer upload do PDF.");
        }
    }

    @PostMapping("/upload/text")
    public ResponseEntity<String> uploadTextExam(@RequestBody ExamTextRequestDTO request,
                                                 @AuthenticationPrincipal User loggedUser) {
        try {
            examService.uploadTextExam(
                    request.getTitle(),
                    request.getDescription(),
                    request.getTags(),
                    (List<QuestionDTO>) request.getText(),
                    loggedUser
            );
            return ResponseEntity.ok("Prova textual salva com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao salvar prova textual: " + e.getMessage());
        }
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<?> getExam(@PathVariable Long id) {
        Optional<Exam> exam = examRepository.findById(id);


        if (exam.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Exam foundExam = exam.get();

        if (foundExam instanceof ExamPdf) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=exam.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(((ExamPdf) foundExam).getPdfData());
        } else if (foundExam instanceof ExamImage) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG) // Ajuste conforme o tipo da imagem
                    .body(((ExamImage) foundExam).getImageData());
        } else if (foundExam instanceof ExamText) {
            return ResponseEntity.ok(foundExam); // Retorna JSON para provas textuais
        } else {
            return ResponseEntity.badRequest().body("Tipo de prova desconhecido.");
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<ExamResponseDTO>> getAllExams() {
        List<Exam> exams = examService.getAllExams();
        List<ExamResponseDTO> examDTOs = exams.stream().map(exam ->
                new ExamResponseDTO(
                        exam.getId(),
                        exam.getTitle(),
                        exam.getDescription(),
                        exam.getTags(),
                        exam.getAuthor() != null ? exam.getAuthor().getName() : null, // Pega apenas o nome do autor
                        exam.getLikesCount() // Inclui o likesCount aqui
                )
        ).collect(Collectors.toList());

        return ResponseEntity.ok(examDTOs);
    }
}
