package com.example.pickup_request;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class PickupRequestApplication {

	public static void main(String[] args) {
		SpringApplication.run(PickupRequestApplication.class, args);
	}

}
