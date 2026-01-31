package com.example.Recycler_Service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class RecyclerServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RecyclerServiceApplication.class, args);
	}

}
