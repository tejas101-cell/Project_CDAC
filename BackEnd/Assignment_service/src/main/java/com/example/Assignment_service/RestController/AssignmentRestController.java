package com.example.Assignment_service.RestController;

import com.example.Assignment_service.AssignmentDTO.AssignmentRequestDTO;
import com.example.Assignment_service.AssignmentDTO.AssignmentResponseDTO;
import com.example.Assignment_service.Service.AssignmentService;
import jakarta.ws.rs.Path;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/assignments")
@RequiredArgsConstructor
public class AssignmentRestController {
    private final AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<AssignmentResponseDTO> assignedCollector(@RequestBody AssignmentRequestDTO requestDTO){
        AssignmentResponseDTO assignemt = assignmentService.assignCollector(requestDTO);
        return ResponseEntity.ok(assignemt);
    }

    // update the request assigned -> accepted
    @PutMapping("/{requestId}/accept")
    public ResponseEntity<String> acceptedAssignment(@PathVariable("requestId") Integer requestId,
                                   @RequestParam Integer collectorId){
        assignmentService.acceptAssignment(requestId, collectorId);
        return ResponseEntity.ok("Assignment accepted");
    }

    // update the assignment to picked
    @PutMapping("/{requestId}/pick")
    public ResponseEntity<String> pickedAssignment(@PathVariable("requestId") Integer requestId,
                                                   @RequestParam Integer collectorId){
        assignmentService.updatePickupStatusToPicked(requestId, collectorId);
        return ResponseEntity.ok("E-waste picked up successfully");
    }
}
