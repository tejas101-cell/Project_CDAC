package com.example.pickup_request.RestController;

import com.example.pickup_request.DTO.CreatePickupRequestDTO;
import com.example.pickup_request.DTO.CreatePickupResponseDTO;
import com.example.pickup_request.DTO.PickupRequestResponseDTO;
import com.example.pickup_request.Service.PickupRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Role") String role) {

        return ResponseEntity.ok(
                pickupRequestService.getPickupRequestById(requestId, userId, role)
        );
    }
    // Endpoint for Tracking Service
    @GetMapping("/pickups/{requestId}/verify/{userId}")
    public void verifyOwnership(
            @PathVariable Integer requestId,
            @PathVariable String userId) {

        pickupRequestService.verifyOwnership(requestId, userId);
    }

    // Get all pickup requests for a specific user
    @GetMapping("/pickups/user/{userId}")
    public ResponseEntity<List<PickupRequestResponseDTO>> getUserPickupRequests(
            @PathVariable String userId,  // 
            @RequestHeader("X-User-Id") String requestingUserId,  // ⭐ STRING
            @RequestHeader("X-User-Role") String role) {

        // Users can only see their own requests
        if (role.toUpperCase().contains("USER") && !role.toUpperCase().contains("ADMIN") && !userId.equals(requestingUserId)) {
            throw new RuntimeException("Access denied");
        }

        return ResponseEntity.ok(
                pickupRequestService.getUserPickupRequests(userId)
        );
    }

    // Get all pickup requests (Admin only)
    @GetMapping("/pickups")
    public ResponseEntity<List<PickupRequestResponseDTO>> getAllPickupRequests(
            @RequestHeader("X-User-Role") String role) {

        if (!role.toUpperCase().contains("ADMIN")) {
            throw new RuntimeException("Admin access required");
        }

        return ResponseEntity.ok(
                pickupRequestService.getAllPickupRequests()
        );
    }

    // Update pickup request status
    @PutMapping("/pickups/{requestId}/status")
    public ResponseEntity<String> updatePickupStatus(
            @PathVariable Integer requestId,
            @RequestParam String status,
            @RequestHeader("X-User-Role") String role) {

       String upperRole = role.toUpperCase();
if (!upperRole.contains("ADMIN") && !upperRole.contains("COLLECTOR")) {
            throw new RuntimeException("Unauthorized");
        }

        pickupRequestService.updateStatus(requestId, status);
        return ResponseEntity.ok("Status updated successfully");
    }

    // Assign collector to pickup request
    @PutMapping("/pickups/{requestId}/assign-collector")
    public ResponseEntity<Void> assignCollector(
            @PathVariable Integer requestId,
            @RequestParam String collectorId) {
        pickupRequestService.assignCollector(requestId, collectorId);
        return ResponseEntity.ok().build();
    }

    // Get all pickup requests for a specific collector
    @GetMapping("/pickups/collector/{collectorId}")
    public ResponseEntity<List<PickupRequestResponseDTO>> getCollectorRequests(
            @PathVariable String collectorId) {
        return ResponseEntity.ok(pickupRequestService.getCollectorRequests(collectorId));
    }
}