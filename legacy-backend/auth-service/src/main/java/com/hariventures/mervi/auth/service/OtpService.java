package com.hariventures.mervi.auth.service;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.hariventures.mervi.auth.model.OtpAttempt;
import com.hariventures.mervi.auth.repository.OtpAttemptRepository;
import com.hariventures.mervi.shared.exception.BaseException;
import com.hariventures.mervi.shared.exception.UnauthorizedException;
import com.hariventures.mervi.shared.security.SecurityConstants;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpAttemptRepository otpAttemptRepository;

    @Value("${mervi.otp.length:6}")
    private int otpLength;

    @Value("${mervi.otp.ttl-seconds:300}")
    private int otpTtlSeconds;

    @Value("${mervi.otp.max-attempts:5}")
    private int maxAttempts;

    @Value("${mervi.otp.cooldown-seconds:60}")
    private int cooldownSeconds;

    private final Random random = new Random();

    public String generateOtp(String identifier, String purpose) {
        String tenantId = TenantContext.getTenantId();
        
        OtpAttempt attempt = otpAttemptRepository.findByTenantIdAndIdentifierAndPurpose(tenantId, identifier, purpose)
                .orElseGet(() -> {
                    OtpAttempt newAttempt = OtpAttempt.builder()
                            .identifier(identifier)
                            .purpose(purpose)
                            .build();
                    newAttempt.ensureTenantContext();
                    return newAttempt;
                });

        if (attempt.getLockedUntil() != null && attempt.getLockedUntil().isAfter(Instant.now())) {
            throw new TooManyRequestsException("Please wait before requesting a new OTP.");
        }

        // Generate OTP
        int max = (int) Math.pow(10, otpLength) - 1;
        String otp = String.format("%0" + otpLength + "d", random.nextInt(max));
        String hash = BCrypt.withDefaults().hashToString(SecurityConstants.BCRYPT_ROUNDS, otp.toCharArray());

        attempt.setOtpHash(hash);
        attempt.setAttempts(0);
        attempt.setExpiresAt(Instant.now().plusSeconds(otpTtlSeconds));
        // Simple cooldown to prevent spamming resend
        attempt.setLockedUntil(Instant.now().plusSeconds(cooldownSeconds));
        
        otpAttemptRepository.save(attempt);
        return otp;
    }

    public void verifyOtp(String identifier, String purpose, String otp) {
        String tenantId = TenantContext.getTenantId();
        
        OtpAttempt attempt = otpAttemptRepository.findByTenantIdAndIdentifierAndPurpose(tenantId, identifier, purpose)
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired OTP"));

        if (attempt.getExpiresAt().isBefore(Instant.now())) {
            throw new UnauthorizedException("OTP has expired");
        }

        if (attempt.getAttempts() >= maxAttempts) {
            throw new UnauthorizedException("Too many failed attempts. Please request a new OTP.");
        }

        BCrypt.Result result = BCrypt.verifyer().verify(otp.toCharArray(), attempt.getOtpHash());
        
        if (!result.verified) {
            attempt.setAttempts(attempt.getAttempts() + 1);
            if (attempt.getAttempts() >= maxAttempts) {
                attempt.setLockedUntil(Instant.now().plusSeconds(15 * 60)); // lock for 15 mins
            }
            otpAttemptRepository.save(attempt);
            throw new UnauthorizedException("Invalid OTP");
        }

        // OTP verified successfully, clear the attempt
        otpAttemptRepository.delete(attempt);
    }
    
    public static class TooManyRequestsException extends BaseException {
        public TooManyRequestsException(String message) {
            super(message, HttpStatus.TOO_MANY_REQUESTS, "TOO_MANY_REQUESTS");
        }
    }
}
