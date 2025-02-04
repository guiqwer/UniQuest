package com.Uniquest.UniQuest.domain.exam;

import com.Uniquest.UniQuest.domain.question.Question;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import lombok.*;

import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExamText extends Exam {

    private Integer totalQuestions;
    private String textContent;

    @OneToMany(
            mappedBy = "examText", // Refere-se ao campo "examText" na classe Question
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JsonManagedReference
    private List<Question> questions;
}