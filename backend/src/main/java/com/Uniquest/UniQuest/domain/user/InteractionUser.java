package com.Uniquest.UniQuest.domain.user;

import com.Uniquest.UniQuest.domain.proof.Proof;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InteractionUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Proof proof;
    private boolean liked;


}
