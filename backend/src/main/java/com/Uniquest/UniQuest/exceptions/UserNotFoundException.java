package com.Uniquest.UniQuest.exceptions;

/**
 * Exceção lançada quando um usuário não é encontrado no sistema.
 * Esta exceção é uma RuntimeException, indicando que é uma condição de erro
 * Pode aceitar uma mensagem personalizada.
 */
public class UserNotFoundException extends RuntimeException {

    private static final String DEFAULT_MESSAGE = "User not found.";
    private static final long serialVersionUID = 1L;

    public UserNotFoundException() {
        super(DEFAULT_MESSAGE);
    }

    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(Throwable cause) {
        super(cause);
    }

    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
