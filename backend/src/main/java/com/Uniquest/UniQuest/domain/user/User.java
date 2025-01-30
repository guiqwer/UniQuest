package com.Uniquest.UniQuest.domain.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserProfile userProfile; //Um usuário tem um perfil.


    private String name;
    private String email;
    private String password;


}
