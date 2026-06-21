package com.hariventures.mervi.user.controller;

import com.hariventures.mervi.shared.dto.ApiResponse;
import com.hariventures.mervi.shared.tenant.TenantContext;
import com.hariventures.mervi.user.dto.UserProfileDto;
import com.hariventures.mervi.user.model.UserProfile;
import com.hariventures.mervi.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me/profile")
    public ApiResponse<UserProfileDto> getMyProfile() {
        String userId = TenantContext.getUserId();
        UserProfile profile = userService.getProfileByUserId(userId);
        return ApiResponse.ok(mapToDto(profile));
    }

    @PutMapping("/me/profile")
    public ApiResponse<UserProfileDto> updateMyProfile(@RequestBody UserProfile profileData) {
        String userId = TenantContext.getUserId();
        UserProfile updated = userService.createOrUpdateProfile(userId, profileData);
        return ApiResponse.ok(mapToDto(updated), "Profile updated successfully");
    }
    
    @GetMapping("/{userId}/profile")
    public ApiResponse<UserProfileDto> getUserProfile(@PathVariable String userId) {
        UserProfile profile = userService.getProfileByUserId(userId);
        return ApiResponse.ok(mapToDto(profile));
    }

    private UserProfileDto mapToDto(UserProfile profile) {
        return UserProfileDto.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .title(profile.getTitle())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .avatarUrl(profile.getAvatarUrl())
                .bio(profile.getBio())
                .workPhone(profile.getWorkPhone())
                .theme(profile.getTheme())
                .language(profile.getLanguage())
                .timezone(profile.getTimezone())
                .notificationPreferences(profile.getNotificationPreferences())
                .build();
    }
}
