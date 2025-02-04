package com.Uniquest.UniQuest.domain.question;

import com.Uniquest.UniQuest.domain.exam.ExamText;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "question_type")
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    private String statement;

    @Column(name = "question_order") // Renomeia a coluna no banco
    private Integer order;

    @ManyToOne(fetch = FetchType.LAZY) // Define o lado "many" do relacionamento
    @JoinColumn(name = "exam_text_id") // Nome da coluna de chave estrangeira
    @JsonBackReference
    private ExamText examText;
}