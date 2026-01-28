package com.example.Driver_serv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class DriverServApplication {

	public static void main(String[] args) {

		SpringApplication.run(DriverServApplication.class, args);
        System.out.println("Connection is successful");
	}
}
