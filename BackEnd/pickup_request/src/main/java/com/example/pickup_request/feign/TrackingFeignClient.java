package com.example.pickup_request.feign;

import com.example.pickup_request.DTO.CreateStatusRequestLogDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "TRACKING-SERVICE",   // must match spring.application.name
        path = "/api/tracking"
)
public interface TrackingFeignClient {
    @PostMapping("/status")
    void logStatus(@RequestBody CreateStatusRequestLogDTO requestDTO);
}