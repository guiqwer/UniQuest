package com.Uniquest.UniQuest.domain.Exam;

import jakarta.persistence.Entity;

@Entity
public class ExamPdf extends Exam {

    private String pdfUrl;
}
