package com.Uniquest.UniQuest.domain.exam;

import com.Uniquest.UniQuest.domain.question.Question;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import java.util.List;

@Entity
public class ExamText extends Exam {

    private Integer totalQuestions;
    private String textContent;

    @OneToMany(
            mappedBy = "examText", // Refere-se ao campo "examText" na classe Question
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<Question> questions;
}