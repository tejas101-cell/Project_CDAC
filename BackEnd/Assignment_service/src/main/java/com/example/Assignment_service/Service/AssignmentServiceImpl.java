package com.example.Assignment_service.Service;

import com.example.Assignment_service.DTO.AssignmentRequestDTO;
import com.example.Assignment_service.DTO.AssignmentResponseDTO;
import com.example.Assignment_service.DTO.StatusLogDTO;
import com.example.Assignment_service.Client.TrackingServiceClient;
import com.example.Assignment_service.Entity.Assignment;
import com.example.Assignment_service.Repository.AssignmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final TrackingServiceClient trackingClient;

    // saving the assignment log
    @Override
    @Transactional
    public AssignmentResponseDTO assignCollector(AssignmentRequestDTO requestDTO) {
        Assignment pickupAssignment = Assignment.builder()
                .collectorId(requestDTO.getCollectorId())
                .requestId(requestDTO.getRequestId())
                .assignedDate(LocalDateTime.now())
                .build();

        // saving the assignment
        Assignment savedAssignment = assignmentRepository.save(pickupAssignment);

        // saving the tracking status
        trackingClient.loggedStatus(new StatusLogDTO(
                requestDTO.getRequestId(),
                "Assigned",
                requestDTO.getCollectorId()
        ));
        return new AssignmentResponseDTO(
                savedAssignment.getAssignmentId()
        );
    }
}
