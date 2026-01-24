package com.example.pickup_request.Service;

import com.example.pickup_request.DTO.CreatePickupRequestDTO;
import com.example.pickup_request.DTO.CreatePickupResponseDTO;
import com.example.pickup_request.DTO.PickupItemResponseDTO;
import com.example.pickup_request.DTO.PickupRequestResponseDTO;
import com.example.pickup_request.Entity.PickupItem;
import com.example.pickup_request.Entity.PickupRequests;
import com.example.pickup_request.Entity.StatusLog;
import com.example.pickup_request.Repository.PickupItemRepository;
import com.example.pickup_request.Repository.PickupRequestRepository;
import com.example.pickup_request.Repository.StatusLogRepository;
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
    private final StatusLogRepository statusLogRepository;

    // creating a pickup request
    @Override
    @Transactional
    public CreatePickupResponseDTO createPickupRequest(CreatePickupRequestDTO requestDTO) {
        // creating a pickup request object from DTO for pickupRequest
        // sending user ID from the requestBody itself
        PickupRequests pickupRequests = PickupRequests.builder()
                .userId(requestDTO.getUserId())
                .requestDate(LocalDateTime.now())
                .pickupDate(requestDTO.getPickupDate())
                .pickupAddress(requestDTO.getPickupAddress())
                .status("Requested")
                .build();
        // save a request into the savedRequest for temporary use
        // this line will save the request
        PickupRequests savedRequest = pickupRequestRepository.save(pickupRequests);

        // build objects for items
        // we will get the List of items
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

        // status log does not have separate service because it will be used by everyone
        // status log object

        StatusLog statusLog = StatusLog.builder()
                .requestId(savedRequest.getRequestId())
                .status("Requested")
                .updatedOn(LocalDateTime.now())
                .updatedBy(requestDTO.getUserId())
                .build();

        // saving a new status log for respective pickupRequest
        statusLogRepository.save(statusLog);

        // just for the confirmation for now
        return new CreatePickupResponseDTO(savedRequest.getRequestId(), "Rquested", "Success");
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
}
