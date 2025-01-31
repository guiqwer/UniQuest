package com.Uniquest.UniQuest.domain.question;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class DiscursiveQuestion extends Question {
    private String rightAnswer;
}
