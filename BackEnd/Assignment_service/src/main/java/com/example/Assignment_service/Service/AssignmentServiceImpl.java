package com.example.Assignment_service.Service;

import com.example.Assignment_service.AssignmentDTO.AssignmentRequestDTO;
import com.example.Assignment_service.AssignmentDTO.AssignmentResponseDTO;
import com.example.Assignment_service.AssignmentDTO.StatusLogDTO;
import com.example.Assignment_service.Client.PickupRequestClient;
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
    private final PickupRequestClient pickupClient;

    // saving the assignment log
    @Override
    @Transactional
    public AssignmentResponseDTO assignCollector(AssignmentRequestDTO requestDTO) {
        Assignment pickupAssignment = Assignment.builder()
                .collectorId(requestDTO.getCollectorId())
                .requestId(requestDTO.getRequestId())
                .assignedDate(LocalDateTime.now())
                .status("Assigned")
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
    // accept the assignment
    @Override
    @Transactional
    public void acceptAssignment(Integer requestId, Integer collectorId) {
        // single assignment will be returned
        // requestId will be different for each row
        Assignment assignment = assignmentRepository.findByRequestId(requestId);

        if (!assignment.getCollectorId().equals(collectorId)){
            throw new RuntimeException("You are not assigned to this request");
        }
        if (!"Assigned".equals(assignment.getStatus())){
            throw new RuntimeException("Must be assigned first");
        }
        assignment.setStatus("Accepted");
        assignmentRepository.save(assignment);
        trackingClient.loggedStatus(new StatusLogDTO(
                requestId,
                "Accepted",
                collectorId
        ));
    }

    @Override
    @Transactional
    public void updatePickupStatusToPicked(Integer requestId, Integer collectorId) {
        Assignment pickupAssignment = assignmentRepository.findByRequestId(requestId);

        if(!pickupAssignment.getCollectorId().equals(collectorId)){
            throw new RuntimeException("Unauthorized collector");
        }
        if (!"Accepted".equals(pickupAssignment.getStatus())){
            throw new RuntimeException("Request must be assigned before picked");
        }
        pickupAssignment.setStatus("Picked");
        pickupClient.updatedPickupStatus(requestId, "Picked");

        // save the log into the status logs
        trackingClient.loggedStatus(new StatusLogDTO(
                requestId,
                "Picked",
                collectorId
        ));
    }

}
