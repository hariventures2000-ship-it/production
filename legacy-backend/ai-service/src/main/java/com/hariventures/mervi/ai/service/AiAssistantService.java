package com.hariventures.mervi.ai.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiAssistantService {

    private final Client geminiClient;
    private String hrPoliciesContext = "";

    @PostConstruct
    public void loadHrPolicies() {
        try {
            ClassPathResource resource = new ClassPathResource("hr-policies.txt");
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                hrPoliciesContext = reader.lines().collect(Collectors.joining("\n"));
                log.info("Successfully loaded HR policies reference file. Characters: {}", hrPoliciesContext.length());
            }
        } catch (Exception e) {
            log.error("Failed to load hr-policies.txt reference file, using fallback policy stub.", e);
            hrPoliciesContext = "Hari Ventures Leave Policies:\n- Casual Leaves: 12 days/year.\n- Sick Leaves: 6 days/year.\n- Salaries paid on the last working day of the month.";
        }
    }

    public String answerHrQuestion(String question) {
        log.info("Processing HR Assistant query: '{}'", question);
        
        String systemPrompt = String.format(
            "You are the friendly corporate HR assistant for Hari Ventures. " +
            "Answer the employee's query based ONLY on the corporate policy context provided below. " +
            "If the query cannot be answered using the policy text, politely state that you do not have that info and suggest emailing hr@hariventures.com. " +
            "Keep the response concise, clear, and professional. Keep formatting clean.\n\n" +
            "Corporate Policies:\n%s\n\n" +
            "Employee Query: %s\n\n" +
            "Answer:",
            hrPoliciesContext,
            question
        );

        try {
            GenerateContentResponse response = geminiClient.models.generateContent(
                "gemini-2.5-flash",
                systemPrompt,
                null
            );
            return response.text();
        } catch (Exception e) {
            log.error("Gemini API call failed for HR Assistant", e);
            return "I'm having trouble connecting to the AI brain right now. Please reach out to HR directly at hr@hariventures.com.";
        }
    }

    public String translateAnalyticsQuery(String query) {
        log.info("Processing Analytics Copilot query: '{}'", query);

        String prompt = String.format(
            "You are a database analytics copilot for the Mervi multi-tenant platform. " +
            "Convert the user's natural language query into a valid MongoDB aggregation pipeline query targeting the 'organization_analytics' collection.\n\n" +
            "Collection Schema:\n" +
            "- tenantId (String, unique identifier for the tenant context)\n" +
            "- activeProjectsCount (Integer, number of ongoing projects)\n" +
            "- totalBudget (Decimal, budget allocated)\n" +
            "- spentBudget (Decimal, budget consumed)\n" +
            "- workforceCount (Integer, total active employees)\n" +
            "- onTimeDeliveryRate (Double, percentage rate)\n" +
            "- projectStatusCounts (Map of String to Integer, keys e.g. Development, Design, Testing, Planning, Completed)\n" +
            "- monthlyRevenue (Map of String to Decimal)\n" +
            "- recentActivity (List of Map of String to String, e.g. key-values for name, lead, status, priority, completion, budget)\n\n" +
            "User query: %s\n\n" +
            "Respond with a JSON structure containing:\n" +
            "1. 'pipeline': A string representing the MongoDB aggregation pipeline array (e.g. '[{ \"$match\": ... }, { \"$group\": ... }]') or a find query.\n" +
            "2. 'explanation': A short, clear 1-2 sentence explanation of what the query calculates in plain English.\n\n" +
            "Output MUST be a valid JSON object. Do not include markdown code block characters like ```json or similar in your response, just the raw JSON object.",
            query
        );

        try {
            GenerateContentResponse response = geminiClient.models.generateContent(
                "gemini-2.5-flash",
                prompt,
                null
            );
            
            String rawText = response.text().trim();
            // Safeguard to remove markdown wrap if LLM fails to omit it
            if (rawText.startsWith("```")) {
                rawText = rawText.replaceAll("^```json\\s*", "")
                                 .replaceAll("^```\\s*", "")
                                 .replaceAll("\\s*```$", "");
            }
            return rawText;
        } catch (Exception e) {
            log.error("Gemini API call failed for Analytics Copilot", e);
            return "{\"pipeline\": \"[]\", \"explanation\": \"The AI service is currently unavailable. Please try again later.\"}";
        }
    }
}
