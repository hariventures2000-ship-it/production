package com.hariventures.mervi.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileDto {
    private String id;
    private String userId;
    private String title;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String bio;
    private String workPhone;
    
    private String theme;
    private String language;
    private String timezone;
    private Map<String, Boolean> notificationPreferences;
}
