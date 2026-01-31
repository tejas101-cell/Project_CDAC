package com.example.pickup_request.Service;


import com.example.pickup_request.DTO.CreatePickupRequestDTO;
import com.example.pickup_request.DTO.CreatePickupResponseDTO;
import com.example.pickup_request.DTO.PickupRequestResponseDTO;

import java.util.List;

public interface PickupRequestService {

    CreatePickupResponseDTO createPickupRequest(CreatePickupRequestDTO requestDTO);

    PickupRequestResponseDTO getPickupRequestById(
            Integer requestId,
            String userId,
            String role
    );

    void verifyOwnership(Integer requestId, String userId);

    List<PickupRequestResponseDTO> getUserPickupRequests(String userId);

    List<PickupRequestResponseDTO> getAllPickupRequests();

    void updateStatus(Integer requestId, String status);

    void assignCollector(Integer requestId, String collectorId);
    
    List<PickupRequestResponseDTO> getCollectorRequests(String collectorId);  
}