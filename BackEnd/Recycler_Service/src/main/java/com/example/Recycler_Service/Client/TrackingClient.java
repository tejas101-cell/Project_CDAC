package com.example.Recycler_Service.Client;

import com.example.Recycler_Service.RecyclingDTO.StatusLogDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "TRACKING-SERVICE") // Call Directly
public interface TrackingClient {
    @PostMapping("/api/tracking/status")
    void logStatus(@RequestBody StatusLogDTO dto);
}


