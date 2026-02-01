package com.example.pickup_request.Service;

import com.example.pickup_request.DTO.*;
import com.example.pickup_request.Entity.PickupItem;
import com.example.pickup_request.Entity.PickupRequests;
import com.example.pickup_request.Repository.PickupItemRepository;
import com.example.pickup_request.Repository.PickupRequestRepository;
import com.example.pickup_request.client.UserClient;
import com.example.pickup_request.feign.TrackingFeignClient;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;
import com.example.pickup_request.feign.AssignmentClient; 


@Service
@RequiredArgsConstructor
public class PickupRequestServiceImpl implements PickupRequestService {

    private final PickupRequestRepository pickupRequestRepository;
    private final PickupItemRepository pickupItemRepository;

    private final UserClient userClient;
    private final TrackingFeignClient trackingFeignClient;
    private final AssignmentClient assignmentRequestClient;

    @Override
    @Transactional
    public CreatePickupResponseDTO createPickupRequest(CreatePickupRequestDTO requestDTO) {

        UserResponseDTO user = userClient.getUserById(requestDTO.getUserId());

        String status = user.getStatus();
        // Allow "Active", "Approved", or null (legacy users)
        if (status != null && !status.equalsIgnoreCase("Active") && !status.equalsIgnoreCase("Approved")) {
            throw new RuntimeException("User account is " + status + ". Pickup requests are only allowed for Active users.");
        }

        // Calculate the next request number for this user
        Integer currentCount = pickupRequestRepository.countByUserId(requestDTO.getUserId());
        Integer nextNo = (currentCount == null) ? 1 : currentCount + 1;
        PickupRequests pickupRequests = PickupRequests.builder()
                .userId(requestDTO.getUserId())
                .userRequestNo(nextNo)
                .requestDate(LocalDateTime.now())
                .pickupDate(requestDTO.getPickupDate())
                .pickupAddress(requestDTO.getPickupAddress())
                .status("Requested")
                .build();

        PickupRequests savedRequest = pickupRequestRepository.save(pickupRequests);

        requestDTO.getItems().forEach(itemDTO -> {
            PickupItem item = PickupItem.builder()
                    .requestId(savedRequest.getRequestId())
                    .itemName(itemDTO.getItemName())
                    .quantity(itemDTO.getQuantity())
                    .remarks(itemDTO.getRemarks())
                    .build();
            pickupItemRepository.save(item);
        });

        CreateStatusRequestLogDTO statusDTO = new CreateStatusRequestLogDTO();
        statusDTO.setRequestId(savedRequest.getRequestId());
        statusDTO.setStatus("Requested");
        statusDTO.setUpdatedBy(requestDTO.getUserId());

        trackingFeignClient.logStatus(statusDTO);

        return new CreatePickupResponseDTO(
                savedRequest.getRequestId(),
                savedRequest.getUserRequestNo(),
                "Requested",
                "Success"
        );
    }

    //  STEP 3: OWNERSHIP CHECK HERE
    @Override
    public PickupRequestResponseDTO getPickupRequestById(
            Integer requestId,
            String userId,
            String role) {

        PickupRequests pickup = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // USER can only see OWN request
        if ("USER".equalsIgnoreCase(role)
                && !pickup.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied: Not your pickup request");
        }

        var items = pickupItemRepository.findByRequestId(requestId)
                .stream()
                .map(item -> new PickupItemResponseDTO(
                        item.getItemName(),
                        item.getQuantity(),
                        item.getRemarks()
                ))
                .toList();

        return new PickupRequestResponseDTO(
                pickup.getRequestId(),
                pickup.getUserId(),
                pickup.getUserRequestNo(),
                pickup.getRequestDate(),
                pickup.getPickupDate(),
                pickup.getPickupAddress(),
                pickup.getStatus(),
                items
        );
    }

    //  Used by Tracking Service via Feign
    @Override
    public void verifyOwnership(Integer requestId, String userId) {

        PickupRequests pickup = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Pickup not found"));

        if (!pickup.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
    }

    @Override
    public List<PickupRequestResponseDTO> getUserPickupRequests(String userId) {
        List<PickupRequests> requests = pickupRequestRepository.findByUserId(userId);

        return requests.stream().map(pickup -> {
            var items = pickupItemRepository.findByRequestId(pickup.getRequestId())
                    .stream()
                    .map(item -> new PickupItemResponseDTO(
                            item.getItemName(),
                            item.getQuantity(),
                            item.getRemarks()
                    ))
                    .toList();

            return new PickupRequestResponseDTO(
                    pickup.getRequestId(),
                    pickup.getUserId(),
                    pickup.getUserRequestNo(),
                    pickup.getRequestDate(),
                    pickup.getPickupDate(),
                    pickup.getPickupAddress(),
                    pickup.getStatus(),
                    items
            );
        }).toList();
    }

    @Override
    public List<PickupRequestResponseDTO> getAllPickupRequests() {
        List<PickupRequests> requests = pickupRequestRepository.findAll();

        return requests.stream().map(pickup -> {
            var items = pickupItemRepository.findByRequestId(pickup.getRequestId())
                    .stream()
                    .map(item -> new PickupItemResponseDTO(
                            item.getItemName(),
                            item.getQuantity(),
                            item.getRemarks()
                    ))
                    .toList();

            return new PickupRequestResponseDTO(
                    pickup.getRequestId(),
                    pickup.getUserId(),
                    pickup.getUserRequestNo(),
                    pickup.getRequestDate(),
                    pickup.getPickupDate(),
                    pickup.getPickupAddress(),
                    pickup.getStatus(),
                    items
            );
        }).toList();
    }

    @Override
    @Transactional
    public void updateStatus(Integer requestId, String status) {
        PickupRequests pickup = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        pickup.setStatus(status);
        pickupRequestRepository.save(pickup);

        // Log status change in tracking service
        CreateStatusRequestLogDTO statusDTO = new CreateStatusRequestLogDTO();
        statusDTO.setRequestId(requestId);
        statusDTO.setStatus(status);
        statusDTO.setUpdatedBy(pickup.getUserId());

        trackingFeignClient.logStatus(statusDTO);
    }

        @Override
        public void assignCollector(Integer requestId, String collectorId) {
        PickupRequests pickup = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
                
        // 1. Save collector to local DB
        pickup.setCollectorId(collectorId);
        pickup.setStatus("SCHEDULED");
        pickupRequestRepository.save(pickup);
        
        // 2. Call Assignment Service
        Map<String, Object> assignmentRequest = new HashMap<>();
        assignmentRequest.put("requestId", requestId);
        assignmentRequest.put("collectorId", collectorId);
        assignmentRequestClient.assignedCollector(assignmentRequest);
        }

        @Override
        public List<PickupRequestResponseDTO> getCollectorRequests(String collectorId) {
        return pickupRequestRepository.findByCollectorId(collectorId)
                .stream()
                .map(this::mapToResponseDTO) // Note: Map to your existing DTO
                .toList();
        }

        private PickupRequestResponseDTO mapToResponseDTO(PickupRequests pickup) {
        var items = pickupItemRepository.findByRequestId(pickup.getRequestId())
                .stream()
                .map(item -> new PickupItemResponseDTO(
                        item.getItemName(),
                        item.getQuantity(),
                        item.getRemarks()
                ))
                .toList();

        return new PickupRequestResponseDTO(
                pickup.getRequestId(),
                pickup.getUserId(),
                pickup.getUserRequestNo(),
                pickup.getRequestDate(),
                pickup.getPickupDate(),
                pickup.getPickupAddress(),
                pickup.getStatus(),
                items
        );
}
}
