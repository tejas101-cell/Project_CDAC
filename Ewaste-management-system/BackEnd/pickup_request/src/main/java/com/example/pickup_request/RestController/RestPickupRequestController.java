package com.example.pickup_request.RestController;

import com.example.pickup_request.DTO.CreatePickupRequestDTO;
import com.example.pickup_request.DTO.CreatePickupResponseDTO;
import com.example.pickup_request.DTO.PickupItemResponseDTO;
import com.example.pickup_request.DTO.PickupRequestResponseDTO;
import com.example.pickup_request.Service.PickupRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class RestPickupRequestController {
    // successful DI
    private final PickupRequestService pickupRequestService;

    @PostMapping("/pickups")
    public ResponseEntity<CreatePickupResponseDTO> createdPickupRequest(@RequestBody CreatePickupRequestDTO requestDTO){
        CreatePickupResponseDTO response = pickupRequestService.createPickupRequest(requestDTO);

        return new ResponseEntity<CreatePickupResponseDTO>(response, HttpStatus.CREATED);
    }

    @GetMapping("/pickups/{requestId}")
    public ResponseEntity<PickupRequestResponseDTO> goPickupRequestByID(@PathVariable("requestId") Integer requestId){
        PickupRequestResponseDTO pickupRequest = pickupRequestService.getPickupRequestById(requestId);
        return ResponseEntity.ok(pickupRequest);
    }
    @GetMapping("/pickups/user/{userId}")
    public ResponseEntity<List<PickupRequestResponseDTO>> getRequestsByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(pickupRequestService.getPickupRequestsByUserId(userId));
    }
}
