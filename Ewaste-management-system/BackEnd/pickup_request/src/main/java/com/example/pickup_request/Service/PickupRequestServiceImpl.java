package com.example.pickup_request.Service;

import java.util.List;


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

    // FEIGN CLIENTS
    private final UserClient userClient;
    private final TrackingFeignClient trackingFeignClient;

    @Override
    @Transactional
    public CreatePickupResponseDTO createPickupRequest(CreatePickupRequestDTO requestDTO) {

        // STEP 1: VERIFY USER
        UserResponseDTO user = userClient.getUserById(requestDTO.getUserId());

        if (!"Active".equalsIgnoreCase(user.getStatus()) && !"Approved".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("User is not active or approved");
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

        // STEP 4: CALL TRACKING SERVICE (Feign)
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
    @Override
    public List<PickupRequestResponseDTO> getPickupRequestsByUserId(Integer userId) {
        return pickupRequestRepository.findByUserId(userId).stream().map(request -> {
            var items = pickupItemRepository.findByRequestId(request.getRequestId())
                    .stream()
                    .map(item -> new PickupItemResponseDTO(
                            item.getItemName(),
                            item.getQuantity(),
                            item.getRemarks()
                    ))
                    .toList();

            return new PickupRequestResponseDTO(
                    request.getRequestId(),
                    request.getUserId(),
                    request.getRequestDate(),
                    request.getPickupDate(),
                    request.getPickupAddress(),
                    request.getStatus(),
                    items
            );
        }).toList();
    }
}
