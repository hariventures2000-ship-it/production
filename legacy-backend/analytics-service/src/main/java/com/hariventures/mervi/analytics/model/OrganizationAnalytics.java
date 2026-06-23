package com.hariventures.mervi.analytics.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "organization_analytics")
@CompoundIndexes({
    @CompoundIndex(name = "tenant_unique_idx", def = "{'tenantId': 1}", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationAnalytics extends TenantAwareEntity {


    @Field("activeProjectsCount")
    @Builder.Default
    private int activeProjectsCount = 12;

    @Field("totalBudget")
    @Builder.Default
    private BigDecimal totalBudget = new BigDecimal("24000000"); // 2.4 Cr

    @Field("spentBudget")
    @Builder.Default
    private BigDecimal spentBudget = new BigDecimal("16320000"); // 1.63 Cr

    @Field("workforceCount")
    @Builder.Default
    private int workforceCount = 156;

    @Field("onTimeDeliveryRate")
    @Builder.Default
    private double onTimeDeliveryRate = 87.0;

    @Field("projectStatusCounts")
    @Builder.Default
    private Map<String, Integer> projectStatusCounts = new HashMap<>();

    @Field("monthlyRevenue")
    @Builder.Default
    private Map<String, BigDecimal> monthlyRevenue = new HashMap<>();

    @Field("recentActivity")
    @Builder.Default
    private List<Map<String, String>> recentActivity = new ArrayList<>();

    public void initializeDefaults() {
        if (projectStatusCounts == null || projectStatusCounts.isEmpty()) {
            projectStatusCounts = new HashMap<>();
            projectStatusCounts.put("Development", 5);
            projectStatusCounts.put("Design", 2);
            projectStatusCounts.put("Testing", 2);
            projectStatusCounts.put("Planning", 1);
            projectStatusCounts.put("Completed", 2);
        }
        if (recentActivity == null || recentActivity.isEmpty()) {
            recentActivity = new ArrayList<>();
            
            Map<String, String> act1 = new HashMap<>();
            act1.put("name", "Mervi Platform v3");
            act1.put("lead", "Arun K.");
            act1.put("status", "Development");
            act1.put("priority", "Critical");
            act1.put("completion", "72");
            act1.put("budget", "₹45L");
            recentActivity.add(act1);

            Map<String, String> act2 = new HashMap<>();
            act2.put("name", "E-Commerce Redesign");
            act2.put("lead", "Priya N.");
            act2.put("status", "Design");
            act2.put("priority", "High");
            act2.put("completion", "35");
            act2.put("budget", "₹28L");
            recentActivity.add(act2);

            Map<String, String> act3 = new HashMap<>();
            act3.put("name", "Mobile Banking App");
            act3.put("lead", "Rahul S.");
            act3.put("status", "Testing");
            act3.put("priority", "High");
            act3.put("completion", "88");
            act3.put("budget", "₹62L");
            recentActivity.add(act3);

            Map<String, String> act4 = new HashMap<>();
            act4.put("name", "AI Analytics Dashboard");
            act4.put("lead", "Sneha M.");
            act4.put("status", "Development");
            act4.put("priority", "Medium");
            act4.put("completion", "45");
            act4.put("budget", "₹18L");
            recentActivity.add(act4);

            Map<String, String> act5 = new HashMap<>();
            act5.put("name", "Client Portal Revamp");
            act5.put("lead", "Vijay T.");
            act5.put("status", "Planning");
            act5.put("priority", "Low");
            act5.put("completion", "10");
            act5.put("budget", "₹15L");
            recentActivity.add(act5);
        }
    }
}
