package com.example.pickup_request.Client;

import com.example.pickup_request.DTO.StatusLogRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "TRACKING-SERVICE")
public interface TrackingFeignClient {
    @PostMapping("tracking/status")
    public ResponseEntity<String> loggedStatus(@RequestBody StatusLogRequestDTO statusReq);
}
