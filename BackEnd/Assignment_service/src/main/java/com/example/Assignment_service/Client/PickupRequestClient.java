package com.example.Assignment_service.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "PICKUP-REQUEST")
public interface PickupRequestClient {
    @PutMapping("/pickups/{requestId}/status")
    public ResponseEntity<String> updatedPickupStatus(@PathVariable("requestId") Integer requestId,
                                                      @RequestParam String status);
}
