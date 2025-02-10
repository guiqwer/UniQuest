package com.Uniquest.UniQuest.exceptions;

public class PasswordResetCodeNotFoundException extends RuntimeException {
    public PasswordResetCodeNotFoundException(String message) {
        super(message);
    }
}
