package com.example.Recycling_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class RecyclingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RecyclingServiceApplication.class, args);
        System.out.println("Connection is successful");
	}

}
