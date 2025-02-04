package com.Uniquest.UniQuest.domain.question;

import com.Uniquest.UniQuest.domain.exam.ExamText;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.FetchType;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
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
    private ExamText examText;
}