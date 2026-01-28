package com.example.pickup_request.Service;


import com.example.pickup_request.DTO.CreatePickupRequestDTO;
import com.example.pickup_request.DTO.CreatePickupResponseDTO;
import com.example.pickup_request.DTO.PickupRequestResponseDTO;

public interface PickupRequestService {

    CreatePickupResponseDTO createPickupRequest(CreatePickupRequestDTO requestDTO);

    PickupRequestResponseDTO getPickupRequestById(
            Integer requestId,
            Integer userId,
            String role
    );

    void verifyOwnership(Integer requestId, Integer userId);
}
