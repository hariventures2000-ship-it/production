package com.hariventures.mervi.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
    private boolean requiresOtp;
    private boolean requiresMfa;
    private boolean requiresMfaSetup;
    private String maskedEmail;
}
