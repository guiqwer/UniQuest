package com.Uniquest.UniQuest.exceptions;

public class ExpiredResetCodeException extends RuntimeException {
    public ExpiredResetCodeException(String message) {
        super(message);
    }
}
