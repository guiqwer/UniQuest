package com.Uniquest.UniQuest.domain.user;

import jakarta.persistence.*;
import lombok.*;

import java.util.Optional;

@Entity
@Data
@Table(name = "\"user\"")
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String email;
    private String password;
    private String education; //escolaridade
    private String areaOfInterest;
    private String favoriteSubject;

    
    @Column(columnDefinition = "BYTEA") // Definição específica pro Postgres
    private byte[] avatar;

}
