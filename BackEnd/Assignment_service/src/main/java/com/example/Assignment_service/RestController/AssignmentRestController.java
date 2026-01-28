package com.example.Assignment_service.RestController;

import com.example.Assignment_service.AssignmentDTO.AssignmentRequestDTO;
import com.example.Assignment_service.AssignmentDTO.AssignmentResponseDTO;
import com.example.Assignment_service.Service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
