package com.Uniquest.UniQuest.domain.exam;

import com.Uniquest.UniQuest.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "exam_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @ElementCollection
    private List<String> tags = new ArrayList<>(); // Inicializa a lista de tags

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    private int likesCount;
}
