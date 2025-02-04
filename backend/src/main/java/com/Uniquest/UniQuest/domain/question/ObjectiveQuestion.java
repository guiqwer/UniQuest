package com.Uniquest.UniQuest.domain.question;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

import java.util.List;

@Entity
@DiscriminatorValue("OBJECTIVE")
@Getter
@Setter
public class ObjectiveQuestion extends Question {
    private List<String> options;
    private String correctAnswer;
}
