package com.example.Recycler_Service.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "PICKUP-SERVICE")
public interface PickupClient {
    @PutMapping("/api/pickups/{requestId}/status")
    ResponseEntity<String> updateStatus(
            @PathVariable("requestId") Integer requestId,
            @RequestParam("status") String status,
            @RequestHeader("X-User-Role") String role);
}
