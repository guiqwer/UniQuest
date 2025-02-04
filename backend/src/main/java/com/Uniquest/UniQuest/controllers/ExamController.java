package com.Uniquest.UniQuest.controllers;

import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.exam.ExamImage;
import com.Uniquest.UniQuest.domain.exam.ExamPdf;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.ExamResponseDTO;
import com.Uniquest.UniQuest.dto.QuestionDTO;
import com.Uniquest.UniQuest.service.ExamService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/exam")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

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
    public ResponseEntity<String> uploadTextExam(@RequestParam String title,
                                                 @RequestBody String description,
                                                 @RequestBody List<String> tags,
                                                 @RequestBody List<QuestionDTO> text, // Alterado para @RequestBody
                                                 @AuthenticationPrincipal User loggedUser) {
        System.out.println("PASSSOUU");
        try {
            examService.uploadTextExam(title, description, tags, text, loggedUser);
            return ResponseEntity.ok("Prova textual salva com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao salvar prova textual: " + e.getMessage());
        }
    }


    @GetMapping("/view/pdf/{id}")
    public ResponseEntity<byte[]> getPDFExam(@PathVariable Long id) {
        Optional<ExamPdf> exam = examService.getPDFExam(id);
        if (exam.isPresent()) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=exam.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(exam.get().getPdfData());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/view/image/{id}")
    public ResponseEntity<byte[]> getImageExam(@PathVariable Long id) {
        Optional<ExamImage> exam = examService.getImageExam(id);
        if (exam.isPresent()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(exam.get().getImageData());
        } else {
            return ResponseEntity.notFound().build();
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
                        exam.getAuthor() != null ? exam.getAuthor().getName() : null // Pega apenas o nome do autor
                )
        ).collect(Collectors.toList());

        return ResponseEntity.ok(examDTOs);
    }



}
