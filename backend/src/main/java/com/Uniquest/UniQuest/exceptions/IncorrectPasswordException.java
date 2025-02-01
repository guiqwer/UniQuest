package com.Uniquest.UniQuest.exceptions;
import org.springframework.http.HttpStatus;


public class IncorrectPasswordException extends RuntimeException{
    private static final String DEFAULT_MESSAGE = "Incorrect Password or Email";
    // Esse atributo vai permitir definir o statusCode da exceção http. Em dúvida pesquisar sobre.
    private static final HttpStatus DEFAULT_CODE = HttpStatus.valueOf(401);

    public IncorrectPasswordException() {
        super(DEFAULT_MESSAGE);
    }
    public IncorrectPasswordException(String message) {
        super(message);
    }

    public static HttpStatus getDefaultCode() {
        return DEFAULT_CODE;
    }
}
