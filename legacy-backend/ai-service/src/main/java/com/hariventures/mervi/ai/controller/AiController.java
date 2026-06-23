package com.hariventures.mervi.ai.controller;

import com.hariventures.mervi.ai.service.AiAssistantService;
import com.hariventures.mervi.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Slf4j
public class AiController {

    private final AiAssistantService aiAssistantService;

    @PostMapping("/hr-assistant")
    public ApiResponse<?> hrAssistant(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.isBlank()) {
            return ApiResponse.error("Message query cannot be empty");
        }
        String answer = aiAssistantService.answerHrQuestion(message);
        return ApiResponse.ok(answer);
    }

    @PostMapping("/analytics-copilot")
    public ApiResponse<?> analyticsCopilot(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        if (query == null || query.isBlank()) {
            return ApiResponse.error("Query cannot be empty");
        }
        String jsonResult = aiAssistantService.translateAnalyticsQuery(query);
        return ApiResponse.ok(jsonResult);
    }
}
