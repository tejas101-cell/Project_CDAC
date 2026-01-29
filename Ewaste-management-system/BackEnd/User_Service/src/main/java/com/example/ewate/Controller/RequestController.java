package com.example.ewate.Controller;

import com.example.ewate.DTO.RequestDTO;
import com.example.ewate.Entity.EwasteRequest;
import com.example.ewate.Service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;

    @PostMapping
    public ResponseEntity<EwasteRequest> createRequest(@RequestBody RequestDTO requestDTO) {
        return ResponseEntity.ok(requestService.createRequest(requestDTO));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EwasteRequest>> getUserRequests(@PathVariable Integer userId) {
        return ResponseEntity.ok(requestService.getRequestsByUserId(userId));
    }

    @GetMapping
    public ResponseEntity<List<EwasteRequest>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/collector/{collectorId}")
    public ResponseEntity<List<EwasteRequest>> getCollectorRequests(@PathVariable Integer collectorId) {
        return ResponseEntity.ok(requestService.getRequestsByCollectorId(collectorId));
    }

    @PutMapping("/{requestId}/status")
    public ResponseEntity<EwasteRequest> updateStatus(@PathVariable Long requestId, @RequestParam String status) {
        return ResponseEntity.ok(requestService.updateStatus(requestId, status));
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<EwasteRequest> getRequestById(@PathVariable Long requestId) {
        return ResponseEntity.ok(requestService.getRequestById(requestId));
    }

    @PutMapping("/{requestId}/assign-collector")
    public ResponseEntity<EwasteRequest> assignCollector(@PathVariable Long requestId, @RequestParam Integer collectorId) {
        return ResponseEntity.ok(requestService.assignCollector(requestId, collectorId));
    }

    @DeleteMapping("/{requestId}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long requestId) {
        requestService.deleteRequest(requestId);
        return ResponseEntity.noContent().build();
    }
}
