package com.example.Assignment_service.Service;

import com.example.Assignment_service.AssignmentDTO.AssignmentRequestDTO;
import com.example.Assignment_service.AssignmentDTO.AssignmentResponseDTO;

public interface AssignmentService {
    public AssignmentResponseDTO assignCollector(AssignmentRequestDTO requestDTO);
    public void acceptAssignment(Integer requestId, Integer collectorId);
    public void updatePickupStatusToPicked(Integer requestId, Integer collectorId);
}
