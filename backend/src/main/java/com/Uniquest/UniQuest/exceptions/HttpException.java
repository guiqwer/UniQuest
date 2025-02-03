package com.Uniquest.UniQuest.exceptions;

import org.springframework.http.HttpStatus;

// Através dessa interface iremos forçar a implementação do método getDefaultCode para exceções http.
public interface HttpException {
    HttpStatus getDefaultCode();
}
