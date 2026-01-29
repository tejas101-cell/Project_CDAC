package com.example.pickup_request.Service;


import com.example.pickup_request.DTO.CreatePickupRequestDTO;
import com.example.pickup_request.DTO.CreatePickupResponseDTO;
import com.example.pickup_request.DTO.PickupRequestResponseDTO;
import java.util.List;

public interface PickupRequestService {
    CreatePickupResponseDTO createPickupRequest(CreatePickupRequestDTO requestDTO);
    PickupRequestResponseDTO getPickupRequestById(Integer requestID);
    List<PickupRequestResponseDTO> getPickupRequestsByUserId(Integer userId);
}
