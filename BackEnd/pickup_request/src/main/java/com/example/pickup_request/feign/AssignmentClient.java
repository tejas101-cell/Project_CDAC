package com.example.pickup_request.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "ASSIGNMENT-SERVICE")
public interface AssignmentClient {
    @PostMapping("/api/assignments")
    Object assignedCollector(@RequestBody Object requestDTO);
}