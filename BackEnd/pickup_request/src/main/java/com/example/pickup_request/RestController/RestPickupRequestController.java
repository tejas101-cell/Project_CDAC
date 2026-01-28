package com.example.pickup_request.RestController;

import com.example.pickup_request.DTO.CreatePickupRequestDTO;
import com.example.pickup_request.DTO.CreatePickupResponseDTO;
import com.example.pickup_request.DTO.PickupRequestResponseDTO;
import com.example.pickup_request.Service.PickupRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RestPickupRequestController {

    private final PickupRequestService pickupRequestService;

    @PostMapping("/pickups")
    public ResponseEntity<CreatePickupResponseDTO> createdPickupRequest(
            @RequestBody CreatePickupRequestDTO requestDTO) {

        return new ResponseEntity<>(
                pickupRequestService.createPickupRequest(requestDTO),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/pickups/{requestId}")
    public ResponseEntity<PickupRequestResponseDTO> getPickupRequestByID(
            @PathVariable Integer requestId,
            @RequestHeader("X-User-Id") Integer userId,
            @RequestHeader("X-User-Role") String role) {

        return ResponseEntity.ok(
                pickupRequestService.getPickupRequestById(requestId, userId, role)
        );
    }

    // Endpoint for Tracking Service
    @GetMapping("/pickups/{requestId}/verify/{userId}")
    public void verifyOwnership(
            @PathVariable Integer requestId,
            @PathVariable Integer userId) {

        pickupRequestService.verifyOwnership(requestId, userId);
    }
}
