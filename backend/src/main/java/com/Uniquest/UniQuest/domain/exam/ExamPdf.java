package com.Uniquest.UniQuest.domain.exam;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@DiscriminatorValue("PDF")
@Data
@EqualsAndHashCode(callSuper = true)
public class ExamPdf extends Exam {

    
    private byte[] pdfData;
}
