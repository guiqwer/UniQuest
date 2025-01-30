package com.Uniquest.UniQuest.domain.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String education; //escolaridade
    private String areaOfInterest;
    private String favoriteSubject;

    @Lob // Marcar que é binário
    @Column(columnDefinition = "BYTEA") // Definição específica pro Postgres
    private byte[] avatar;
}
