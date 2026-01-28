package com.example.Assignment_service.Client;

import com.example.Assignment_service.DTO.StatusLogDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "TRACKING-SERVICE")
public interface TrackingServiceClient {
    @PostMapping("/api/tracking/status")
    public void loggedStatus(@RequestBody StatusLogDTO statusReq);
}
