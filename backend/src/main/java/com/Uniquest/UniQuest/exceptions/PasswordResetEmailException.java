package com.Uniquest.UniQuest.exceptions;

public class PasswordResetEmailException extends RuntimeException {
    public PasswordResetEmailException(String message) {
        super(message);
    }
}
