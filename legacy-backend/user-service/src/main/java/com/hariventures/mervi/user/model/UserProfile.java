package com.hariventures.mervi.user.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.util.Map;

/**
 * UserProfile document — stored in users_db.user_profiles.
 * Contains detailed profile information separated from auth credentials.
 */
@Document(collection = "user_profiles")
@CompoundIndexes({
    @CompoundIndex(name = "tenant_user_idx", def = "{'tenantId': 1, 'userId': 1}", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile extends TenantAwareEntity {

    @Field("userId")
    private String userId;

    @Field("title")
    private String title;

    @Field("firstName")
    private String firstName;

    @Field("lastName")
    private String lastName;

    @Field("preferredName")
    private String preferredName;

    @Field("avatarUrl")
    private String avatarUrl;

    @Field("coverUrl")
    private String coverUrl;

    @Field("bio")
    private String bio;

    // ─── Contact Info ───────────────────────────────────────────────────
    @Field("personalEmail")
    private String personalEmail;

    @Field("workPhone")
    private String workPhone;

    @Field("personalPhone")
    private String personalPhone;

    @Field("emergencyContactName")
    private String emergencyContactName;

    @Field("emergencyContactPhone")
    private String emergencyContactPhone;

    // ─── Address ────────────────────────────────────────────────────────
    @Field("addressLine1")
    private String addressLine1;

    @Field("addressLine2")
    private String addressLine2;

    @Field("city")
    private String city;

    @Field("state")
    private String state;

    @Field("country")
    private String country;

    @Field("postalCode")
    private String postalCode;

    // ─── Personal Details ───────────────────────────────────────────────
    @Field("dateOfBirth")
    private LocalDate dateOfBirth;

    @Field("gender")
    private String gender;

    @Field("nationality")
    private String nationality;

    // ─── Preferences ────────────────────────────────────────────────────
    @Field("timezone")
    private String timezone;

    @Field("language")
    private String language;

    @Field("theme")
    private String theme; // light/dark/system

    @Field("notificationPreferences")
    private Map<String, Boolean> notificationPreferences;

    // ─── Social Links ───────────────────────────────────────────────────
    @Field("linkedinUrl")
    private String linkedinUrl;

    @Field("githubUrl")
    private String githubUrl;

    @Field("twitterUrl")
    private String twitterUrl;
}
