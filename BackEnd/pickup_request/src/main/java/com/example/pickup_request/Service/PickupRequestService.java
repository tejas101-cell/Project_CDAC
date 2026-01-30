package com.example.pickup_request.Service;


import com.example.pickup_request.DTO.CreatePickupRequestDTO;
import com.example.pickup_request.DTO.CreatePickupResponseDTO;
import com.example.pickup_request.DTO.PickupRequestResponseDTO;

public interface PickupRequestService {
    CreatePickupResponseDTO createPickupRequest(CreatePickupRequestDTO requestDTO);
    PickupRequestResponseDTO getPickupRequestById(Integer requestID);
    void updatePickupStatus(Integer requestId, String status);
}
