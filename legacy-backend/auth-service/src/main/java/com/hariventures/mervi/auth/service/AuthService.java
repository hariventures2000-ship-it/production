package com.hariventures.mervi.auth.service;

import com.hariventures.mervi.auth.model.User;
import com.hariventures.mervi.auth.repository.UserRepository;
import com.hariventures.mervi.shared.enums.AuthType;
import com.hariventures.mervi.shared.enums.Role;
import com.hariventures.mervi.shared.exception.ResourceNotFoundException;
import com.hariventures.mervi.shared.exception.UnauthorizedException;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public User getActiveUserByEmail(String email) {
        return userRepository.findByTenantIdAndEmail(TenantContext.getTenantId(), email)
                .filter(User::isActive)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or user not found"));
    }

    public User getActiveUserByUsername(String username) {
        return userRepository.findByTenantIdAndUsername(TenantContext.getTenantId(), username)
                .filter(User::isActive)
                .orElseThrow(() -> new UnauthorizedException("Invalid username or user not found"));
    }
    
    public User getUserById(String id) {
        return userRepository.findByIdAndTenantId(id, TenantContext.getTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public void incrementFailedLogin(User user) {
        user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
        if (user.getFailedLoginAttempts() >= 5) {
            user.setLockoutUntil(java.time.Instant.now().plusSeconds(15 * 60));
        }
        userRepository.save(user);
    }

    public void resetFailedLogin(User user) {
        if (user.getFailedLoginAttempts() > 0 || user.getLockoutUntil() != null) {
            user.setFailedLoginAttempts(0);
            user.setLockoutUntil(null);
            user.setLastFailedLoginAt(null);
            userRepository.save(user);
        }
    }

    public void updateLastLogin(User user) {
        user.setLastLoginAt(java.time.Instant.now());
        userRepository.save(user);
    }
}
