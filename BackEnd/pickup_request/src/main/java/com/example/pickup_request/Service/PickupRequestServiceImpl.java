package com.example.pickup_request.Service;

import com.example.pickup_request.Client.TrackingFeignClient;
import com.example.pickup_request.DTO.*;
import com.example.pickup_request.Entity.PickupItem;
import com.example.pickup_request.Entity.PickupRequests;
import com.example.pickup_request.Repository.PickupItemRepository;
import com.example.pickup_request.Repository.PickupRequestRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PickupRequestServiceImpl implements PickupRequestService{

    // final tells that you don't need to use @Autowired annotation
    private final PickupRequestRepository pickupRequestRepository;
    private final PickupItemRepository pickupItemRepository;
    private final TrackingFeignClient trackingFeignClient;

    // creating a pickup request
    @Override
    public CreatePickupResponseDTO createPickupRequest(CreatePickupRequestDTO requestDTO) {

        PickupRequests savedRequest = savePickup(requestDTO);

        // save the status
        trackingFeignClient.loggedStatus(new StatusLogRequestDTO(
                savedRequest.getRequestId(),
                "Requested",
                requestDTO.getUserId()
                )
        );

        return new CreatePickupResponseDTO(savedRequest.getRequestId(), "Rquested", "Success");
    }
    // creating pickup request should be transactional
    @Transactional
    public PickupRequests savePickup(CreatePickupRequestDTO requestDTO){
        PickupRequests pickupRequests = PickupRequests.builder()
                .userId(requestDTO.getUserId())
                .requestDate(LocalDateTime.now())
                .pickupDate(requestDTO.getPickupDate())
                .pickupAddress(requestDTO.getPickupAddress())
                .status("Requested")
                .build();

        // save pickup request into pickup requests
        PickupRequests savedRequest = pickupRequestRepository.save(pickupRequests);

        requestDTO.getItems().forEach(itemDTO ->{
            PickupItem item = PickupItem.builder()
                    // using the current request ID and assigning the values to
                    .requestId(savedRequest.getRequestId())
                    .itemName(itemDTO.getItemName())
                    .quantity(itemDTO.getQuantity())
                    .remarks(itemDTO.getRemarks())
                    .build();

            // saving items into pickupItem table
            pickupItemRepository.save(item);
        });
        return savedRequest;
    }
    @Override
    public PickupRequestResponseDTO getPickupRequestById(Integer requestID) {
        // getting the pickup request
        PickupRequests pickupRequests = pickupRequestRepository.findById(requestID)
                .orElseThrow(()-> new RuntimeException("Request not found"));

        // item has the type pickupItem
        var items = pickupItemRepository.findByRequestId(requestID)
                .stream()
                .map(item-> new PickupItemResponseDTO(item.getItemName(), item.getQuantity(), item.getRemarks()
                )).toList();

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
    @Transactional
    public void updatePickupStatus(Integer requestId, String status) {
        int updated = pickupRequestRepository.updateStatus(requestId, status);
        if (updated == 0){
            throw new RuntimeException("Pickup request not found");
        }
    }
}
