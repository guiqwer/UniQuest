package com.Uniquest.UniQuest.exceptions;

import org.springframework.http.HttpStatus;

public class ServerErrorException extends RuntimeException implements HttpException{
    private static final String DEFAULT_MESSAGE = "Server error.";
    private static final HttpStatus DEFAULT_CODE = HttpStatus.valueOf(500);

    public ServerErrorException() {
        super(DEFAULT_MESSAGE);
    }
    public ServerErrorException(String message) {
        super(message);
    }
    public ServerErrorException(Throwable cause) {super(DEFAULT_MESSAGE, cause);}
    public ServerErrorException(String message, Throwable cause) {super(message, cause);}

    @Override
    public HttpStatus getDefaultCode() {
        return DEFAULT_CODE;
    }
}
