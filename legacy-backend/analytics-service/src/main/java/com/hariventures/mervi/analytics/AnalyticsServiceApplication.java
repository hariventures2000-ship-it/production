package com.hariventures.mervi.analytics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = {
    "com.hariventures.mervi.analytics",
    "com.hariventures.mervi.shared"
})
@EnableMongoAuditing
@EnableMongoRepositories(basePackages = {
    "com.hariventures.mervi.analytics.repository"
})
public class AnalyticsServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AnalyticsServiceApplication.class, args);
    }
}
