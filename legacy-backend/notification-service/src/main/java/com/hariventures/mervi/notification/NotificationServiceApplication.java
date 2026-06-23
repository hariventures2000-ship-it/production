package com.hariventures.mervi.notification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = {
    "com.hariventures.mervi.notification",
    "com.hariventures.mervi.shared"
})
@EnableMongoAuditing
@EnableMongoRepositories(basePackages = {
    "com.hariventures.mervi.notification.repository"
})
public class NotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }
}
