package com.Uniquest.UniQuest.domain.user;

import com.Uniquest.UniQuest.utils.GenerateRandomCodeUtil;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class PasswordResetCode {

    private static final int EXPIRATION_MINUTES = 10; // Código expira em 10 minutos

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resetCode;  // Código de 6 dígitos

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime expiryDate;

    public PasswordResetCode() {
    }

    public PasswordResetCode(User user) {
        this.user = user;
        this.resetCode = GenerateRandomCodeUtil.generateRandomCode();
        this.expiryDate = LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES);
    }



}
