package com.example.pickup_request.Service;

import com.example.pickup_request.DTO.*;
import com.example.pickup_request.Entity.PickupItem;
import com.example.pickup_request.Entity.PickupRequests;
import com.example.pickup_request.Entity.StatusLog;
import com.example.pickup_request.Repository.PickupItemRepository;
import com.example.pickup_request.Repository.PickupRequestRepository;
import com.example.pickup_request.Repository.StatusLogRepository;
import com.example.pickup_request.client.UserClient;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PickupRequestServiceImpl implements PickupRequestService {

    private final PickupRequestRepository pickupRequestRepository;
    private final PickupItemRepository pickupItemRepository;
    private final StatusLogRepository statusLogRepository;

    // ADD FEIGN CLIENT
    private final UserClient userClient;

    @Override
    @Transactional
    public CreatePickupResponseDTO createPickupRequest(CreatePickupRequestDTO requestDTO) {

        // STEP 1: VERIFY USER FROM USER SERVICE
        UserResponseDTO user = userClient.getUserById(requestDTO.getUserId());

        if (!"Active".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("User is not active");
        }

        // STEP 2: CREATE PICKUP REQUEST
        PickupRequests pickupRequests = PickupRequests.builder()
                .userId(requestDTO.getUserId())
                .requestDate(LocalDateTime.now())
                .pickupDate(requestDTO.getPickupDate())
                .pickupAddress(requestDTO.getPickupAddress())
                .status("Requested")
                .build();

        PickupRequests savedRequest = pickupRequestRepository.save(pickupRequests);

        // STEP 3: SAVE PICKUP ITEMS
        requestDTO.getItems().forEach(itemDTO -> {
            PickupItem item = PickupItem.builder()
                    .requestId(savedRequest.getRequestId())
                    .itemName(itemDTO.getItemName())
                    .quantity(itemDTO.getQuantity())
                    .remarks(itemDTO.getRemarks())
                    .build();

            pickupItemRepository.save(item);
        });

        // STEP 4: STATUS LOG
        StatusLog statusLog = StatusLog.builder()
                .requestId(savedRequest.getRequestId())
                .status("Requested")
                .updatedOn(LocalDateTime.now())
                .updatedBy(requestDTO.getUserId())
                .build();

        statusLogRepository.save(statusLog);

        return new CreatePickupResponseDTO(
                savedRequest.getRequestId(),
                "Requested",
                "Success"
        );
    }

    @Override
    public PickupRequestResponseDTO getPickupRequestById(Integer requestID) {

        PickupRequests pickupRequests = pickupRequestRepository.findById(requestID)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        var items = pickupItemRepository.findByRequestId(requestID)
                .stream()
                .map(item -> new PickupItemResponseDTO(
                        item.getItemName(),
                        item.getQuantity(),
                        item.getRemarks()
                ))
                .toList();

        return new PickupRequestResponseDTO(
                pickupRequests.getRequestId(),
                pickupRequests.getUserId(),
                pickupRequests.getRequestDate(),
                pickupRequests.getPickupDate(),
                pickupRequests.getPickupAddress(),
                pickupRequests.getStatus(),
                items
        );
    }
}
