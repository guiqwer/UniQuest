package com.Uniquest.UniQuest.exceptions;

import com.Uniquest.UniQuest.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// Vai permitir que as exceções sejam retornadas como erros http normais.
// Para fazer a implementação de outros basta seguir os exemplos já criados neste arquivo.

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(ex.getMessage());
        // Utilizamos UserNotFoundException.getDefaultCode() por se tratar de um método estatico (recomendacao do Intelijei)
        return ResponseEntity.status(UserNotFoundException.getDefaultCode()).body(error);
    }
    @ExceptionHandler(IncorrectPasswordException.class)
    public ResponseEntity<ErrorResponse> handleIncorrectPasswordException(IncorrectPasswordException ex) {
        ErrorResponse error = new ErrorResponse(ex.getMessage());
        return ResponseEntity.status(IncorrectPasswordException.getDefaultCode()).body(error);
    }
}
