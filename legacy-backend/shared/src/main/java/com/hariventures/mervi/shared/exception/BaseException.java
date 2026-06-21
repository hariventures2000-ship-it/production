package com.hariventures.mervi.shared.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base exception for all Mervi business exceptions.
 */
@Getter
public abstract class BaseException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;

    protected BaseException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }
}
