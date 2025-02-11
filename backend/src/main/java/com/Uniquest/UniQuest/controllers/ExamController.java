package com.Uniquest.UniQuest.controllers;

import com.Uniquest.UniQuest.domain.exam.Exam;
import com.Uniquest.UniQuest.domain.exam.ExamImage;
import com.Uniquest.UniQuest.domain.exam.ExamPdf;
import com.Uniquest.UniQuest.domain.exam.ExamText;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.exam.ExamGenerateRequestDTO;
import com.Uniquest.UniQuest.dto.exam.ExamListRequestDTO;
import com.Uniquest.UniQuest.dto.exam.ExamListResponseDTO;
import com.Uniquest.UniQuest.dto.exam.ExamTextRequestDTO;
import com.Uniquest.UniQuest.dto.question.QuestionDTO;
import com.Uniquest.UniQuest.service.ExamService;
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

@RestController
@RequestMapping("/exam")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;
    private final ExamRepository examRepository;

    @PostMapping("/upload/image")
    public ResponseEntity<String> uploadImageExam(@RequestParam String title,
                                                  @RequestParam String description,
                                                  @RequestParam List<String> tags,
                                                  @RequestParam("file") MultipartFile file,
                                                  @AuthenticationPrincipal User loggedUser) {
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
                                                @RequestParam List<String> tags,
                                                @RequestParam("file") MultipartFile file,
                                                @AuthenticationPrincipal User loggedUser) {
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
            Long id = examService.uploadTextExam(
                    request.getTitle(),
                    request.getDescription(),
                    request.getTags(),
                    (List<QuestionDTO>) request.getText(),
                    loggedUser
            );
            return ResponseEntity.ok("ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao salvar prova textual: " + e.getMessage());
        }
    }

    @PostMapping("/generate/text")
    public ResponseEntity<?> generateTextExam(@RequestBody ExamGenerateRequestDTO request){
        try{
            return ResponseEntity.ok("ID: " + examService.generateTextExam(request.getId()));
        } catch (Exception e) {
            throw new RuntimeException(e);
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
                    .contentType(MediaType.IMAGE_PNG)
                    .body(((ExamImage) foundExam).getImageData());
        } else if (foundExam instanceof ExamText) {
            return ResponseEntity.ok(foundExam);
        } else {
            return ResponseEntity.badRequest().body("Tipo de prova desconhecido.");
        }
    }

    @PostMapping("/list")
    public ResponseEntity<List<ExamListResponseDTO>> getAllExams(@RequestBody ExamListRequestDTO request,
                                                                 @AuthenticationPrincipal User user) {
        String   userId = user != null ? user.getId() : null; // Se o usuário não estiver autenticado, userId será null
        List<Exam> exams = examService.getAllExamsWithFilters(request);
        List<ExamListResponseDTO> examDTOs = examService.convertExamsToDTOs(exams, userId);
        return ResponseEntity.ok(examDTOs);
    }



}
