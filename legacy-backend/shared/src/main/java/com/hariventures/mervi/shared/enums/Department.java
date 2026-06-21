package com.hariventures.mervi.shared.enums;

/**
 * Organization departments.
 */
public enum Department {
    WEBSITE_DEVELOPMENT("Website Development"),
    PC_BUILD("PC Build"),
    MOBILE_APP("Mobile App Development"),
    AI_SOLUTIONS("AI Solutions"),
    UI_UX_DESIGN("UI/UX Design"),
    DIGITAL_MARKETING("Digital Marketing"),
    SUPPORT_MAINTENANCE("Support & Maintenance"),
    HUMAN_RESOURCES("Human Resources"),
    FINANCE("Finance"),
    OPERATIONS("Operations");

    private final String label;

    Department(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
