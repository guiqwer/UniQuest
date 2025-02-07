package com.Uniquest.UniQuest.domain.user;

import com.Uniquest.UniQuest.utils.GenerateRandomCodeUtil;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailChangeCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // O usuário que está solicitando a troca de e-mail

    private String newEmail;  // Novo e-mail para o qual o usuário quer trocar

    private String code;  // O código gerado para validar a troca de e-mail

    private LocalDateTime expirationDate;  // Data de expiração do código de troca

    // Construtor específico para criação com novo e-mail e geração do código
    public EmailChangeCode(User user, String newEmail) {
        this.user = user;
        this.newEmail = newEmail;
        this.code = GenerateRandomCodeUtil.generateRandomCode();  // Gerando o código automaticamente
        this.expirationDate = LocalDateTime.now().plusMinutes(15);  // Expira em 15 minutos
    }
}
