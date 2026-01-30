package com.example.Recycling_service.Client;

import com.example.Recycling_service.RecyclingDTO.StatusLogDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "TRACKING-SERVICE")
public interface TrackingClient {
    @PostMapping("/tracking/status")
    public ResponseEntity<String> loggedStatus(@RequestBody StatusLogDTO statusReq);
}

