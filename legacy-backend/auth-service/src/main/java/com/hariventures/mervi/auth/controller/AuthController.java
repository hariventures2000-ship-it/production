package com.hariventures.mervi.auth.controller;

import com.hariventures.mervi.auth.dto.request.ClientLoginRequest;
import com.hariventures.mervi.auth.dto.request.InternalLoginRequest;
import com.hariventures.mervi.auth.dto.request.VerifyOtpRequest;
import com.hariventures.mervi.auth.dto.response.AuthResponse;
import com.hariventures.mervi.auth.dto.response.TokenResponse;
import com.hariventures.mervi.auth.model.User;
import com.hariventures.mervi.auth.service.AuthService;
import com.hariventures.mervi.auth.service.OtpService;
import com.hariventures.mervi.auth.service.SessionService;
import com.hariventures.mervi.shared.dto.ApiResponse;
import com.hariventures.mervi.shared.enums.AuthType;
import com.hariventures.mervi.shared.security.JwtTokenProvider;
import com.hariventures.mervi.shared.security.SecurityConstants;
import com.hariventures.mervi.shared.tenant.TenantContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final SessionService sessionService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/client/login")
    public ApiResponse<AuthResponse> clientLogin(@Valid @RequestBody ClientLoginRequest request) {
        User user = authService.getActiveUserByEmail(request.getEmail());
        
        if (user.getAuthType() != AuthType.CLIENT) {
            throw new IllegalArgumentException("Invalid authentication flow for this user");
        }

        String otp = otpService.generateOtp(user.getEmail(), "LOGIN");
        // TODO: Publish OTP event to Kafka for Notification Service to send email
        
        String maskedEmail = user.getEmail().replaceAll("(^[^@]{3}|(?!^)\\G)[^@]", "$1*");

        return ApiResponse.ok(AuthResponse.builder()
                .requiresOtp(true)
                .maskedEmail(maskedEmail)
                .build());
    }

    @PostMapping("/client/verify-otp")
    public ResponseEntity<ApiResponse<TokenResponse>> verifyClientOtp(
            @Valid @RequestBody VerifyOtpRequest request,
            HttpServletRequest servletRequest) {
        
        otpService.verifyOtp(request.getEmail(), "LOGIN", request.getOtp());
        
        User user = authService.getActiveUserByEmail(request.getEmail());
        authService.updateLastLogin(user);

        return buildTokenResponse(user, servletRequest);
    }

    @PostMapping("/internal/login")
    public ApiResponse<AuthResponse> internalLogin(@Valid @RequestBody InternalLoginRequest request) {
        // Simple mock for internal login until password service is complete
        User user = authService.getActiveUserByUsername(request.getUsername());
        
        if (user.getAuthType() == AuthType.CLIENT) {
            throw new IllegalArgumentException("Invalid authentication flow for this user");
        }

        // Note: Password verification and MFA logic would be here
        
        return ApiResponse.ok(AuthResponse.builder()
                .requiresMfa(true)
                .requiresMfaSetup(!user.isMfaEnabled())
                .build());
    }

    private ResponseEntity<ApiResponse<TokenResponse>> buildTokenResponse(User user, HttpServletRequest request) {
        // Generate Tokens
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getRole(), user.getAuthType(), user.getTenantId(), user.getTokenVersion());
        
        // This would create a session and generate refresh/route tokens
        String sessionId = "mock-session-id"; 
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId(), sessionId);
        String routeSessionToken = jwtTokenProvider.generateRouteSessionToken(
                user.getId(), user.getRole(), user.getAuthType(), user.getTenantId(), user.getTokenVersion());

        // Set HttpOnly cookies
        ResponseCookie refreshCookie = ResponseCookie.from(SecurityConstants.REFRESH_TOKEN_COOKIE, refreshToken)
                .httpOnly(true)
                .secure(request.isSecure())
                .path("/api/v1/auth/refresh")
                .maxAge(Duration.ofDays(7))
                .sameSite("Strict")
                .build();

        ResponseCookie routeCookie = ResponseCookie.from(SecurityConstants.ROUTE_SESSION_COOKIE, routeSessionToken)
                .httpOnly(true)
                .secure(request.isSecure())
                .path("/")
                .maxAge(Duration.ofMinutes(5))
                .sameSite("Strict")
                .build();

        TokenResponse tokenResponse = TokenResponse.builder()
                .accessToken(accessToken)
                .expiresIn(jwtTokenProvider.getAccessExpirySeconds())
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .header(HttpHeaders.SET_COOKIE, routeCookie.toString())
                .body(ApiResponse.ok(tokenResponse, "Login successful"));
    }
}
