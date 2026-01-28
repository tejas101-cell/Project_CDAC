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

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PickupRequestServiceImpl implements PickupRequestService {

    private final PickupRequestRepository pickupRequestRepository;
    private final PickupItemRepository pickupItemRepository;

    private final UserClient userClient;
    private final TrackingFeignClient trackingFeignClient;

    @Override
    @Transactional
    public CreatePickupResponseDTO createPickupRequest(CreatePickupRequestDTO requestDTO) {

        UserResponseDTO user = userClient.getUserById(requestDTO.getUserId());

        if (!"Active".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("User is not active");
        }

        PickupRequests pickupRequests = PickupRequests.builder()
                .userId(requestDTO.getUserId())
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
                "Requested",
                "Success"
        );
    }

    //  STEP 3: OWNERSHIP CHECK HERE
    @Override
    public PickupRequestResponseDTO getPickupRequestById(
            Integer requestId,
            Integer userId,
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
                pickup.getRequestDate(),
                pickup.getPickupDate(),
                pickup.getPickupAddress(),
                pickup.getStatus(),
                items
        );
    }

    //  Used by Tracking Service via Feign
    @Override
    public void verifyOwnership(Integer requestId, Integer userId) {

        PickupRequests pickup = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Pickup not found"));

        if (!pickup.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
    }
}
