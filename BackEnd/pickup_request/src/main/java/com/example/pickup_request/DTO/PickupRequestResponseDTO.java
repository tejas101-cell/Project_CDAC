package com.example.pickup_request.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PickupRequestResponseDTO {
    private Integer requestID;
    private String userID;
    private LocalDateTime requestDate;
    private LocalDate pickupDate;
    private String pickupAddress;
    private String status;
    private List<PickupItemResponseDTO> items;
}
