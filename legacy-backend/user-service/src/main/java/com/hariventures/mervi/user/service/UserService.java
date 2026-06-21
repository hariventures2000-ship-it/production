package com.hariventures.mervi.user.service;

import com.hariventures.mervi.shared.exception.ResourceNotFoundException;
import com.hariventures.mervi.shared.tenant.TenantContext;
import com.hariventures.mervi.user.model.UserProfile;
import com.hariventures.mervi.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository userProfileRepository;

    public UserProfile getProfileByUserId(String userId) {
        String tenantId = TenantContext.getTenantId();
        return userProfileRepository.findByTenantIdAndUserId(tenantId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile", "userId", userId));
    }

    public UserProfile createOrUpdateProfile(String userId, UserProfile profileData) {
        String tenantId = TenantContext.getTenantId();
        
        UserProfile profile = userProfileRepository.findByTenantIdAndUserId(tenantId, userId)
                .orElseGet(() -> {
                    UserProfile newProfile = new UserProfile();
                    newProfile.setUserId(userId);
                    newProfile.ensureTenantContext();
                    
                    // Defaults
                    newProfile.setTheme("system");
                    newProfile.setLanguage("en-US");
                    newProfile.setTimezone("UTC");
                    newProfile.setNotificationPreferences(new HashMap<>());
                    
                    return newProfile;
                });

        // Update fields if provided
        if (profileData.getFirstName() != null) profile.setFirstName(profileData.getFirstName());
        if (profileData.getLastName() != null) profile.setLastName(profileData.getLastName());
        if (profileData.getTitle() != null) profile.setTitle(profileData.getTitle());
        if (profileData.getBio() != null) profile.setBio(profileData.getBio());
        if (profileData.getAvatarUrl() != null) profile.setAvatarUrl(profileData.getAvatarUrl());
        if (profileData.getWorkPhone() != null) profile.setWorkPhone(profileData.getWorkPhone());
        
        return userProfileRepository.save(profile);
    }
}
