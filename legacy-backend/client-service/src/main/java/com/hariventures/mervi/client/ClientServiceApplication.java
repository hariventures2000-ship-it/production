package com.hariventures.mervi.client;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = {
    "com.hariventures.mervi.client",
    "com.hariventures.mervi.shared"
})
@EnableMongoAuditing
@EnableMongoRepositories(basePackages = {
    "com.hariventures.mervi.client.repository"
})
public class ClientServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClientServiceApplication.class, args);
    }
}
