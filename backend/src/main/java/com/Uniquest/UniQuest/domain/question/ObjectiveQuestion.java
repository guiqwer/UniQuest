package com.Uniquest.UniQuest.domain.question;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

import java.util.List;
import java.util.Map;

@Entity
@DiscriminatorValue("OBJECTIVE")
@Getter
@Setter
public class ObjectiveQuestion extends Question {
    List<String> options;
    String correctAnswer;
}
