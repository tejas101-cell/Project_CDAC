package com.example.Assignment_service.Service;

import com.example.Assignment_service.AssignmentDTO.AssignmentRequestDTO;
import com.example.Assignment_service.AssignmentDTO.AssignmentResponseDTO;

public interface AssignmentService {
    public AssignmentResponseDTO assignCollector(AssignmentRequestDTO requestDTO);
}
