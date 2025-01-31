package com.Uniquest.UniQuest.domain.exam;

import jakarta.persistence.Entity;

@Entity
public class ExamPdf extends Exam {

    private String pdfUrl;
}
