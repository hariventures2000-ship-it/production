package com.hariventures.mervi.auth.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TokenResponse {
    private String accessToken;
    private long expiresIn;
    // Note: refreshToken and routeSessionToken are set as HttpOnly cookies, not returned in body
}
