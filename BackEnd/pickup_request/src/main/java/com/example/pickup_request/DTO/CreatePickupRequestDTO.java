package com.example.pickup_request.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePickupRequestDTO {
    private String userId;
    private LocalDate pickupDate;
    private String pickupAddress;
    private List<PickupItemRequestDTO> items;
}
