package com.example.pickup_request.client;

import com.example.pickup_request.DTO.UserResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USER-SERVICE")
public interface UserClient {

    @GetMapping("/api/users/{userId}")
    UserResponseDTO getUserById(@PathVariable("userId") Integer userId);
}
