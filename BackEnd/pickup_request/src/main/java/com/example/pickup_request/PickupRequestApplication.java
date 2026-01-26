package com.example.pickup_request;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class PickupRequestApplication {

	public static void main(String[] args) {
		SpringApplication.run(PickupRequestApplication.class, args);
        System.out.println("Connection is successful");
	}
}
