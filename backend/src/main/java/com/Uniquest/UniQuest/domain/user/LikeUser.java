package com.Uniquest.UniQuest.domain.user;

import com.Uniquest.UniQuest.domain.exam.Exam;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Exam exam;
    private boolean liked;
}
