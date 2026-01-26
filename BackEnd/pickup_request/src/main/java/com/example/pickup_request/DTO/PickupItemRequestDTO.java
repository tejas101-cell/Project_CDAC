package com.example.pickup_request.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PickupItemRequestDTO {
    private String itemName;
    private Integer quantity;
    private String remarks;
    private String pickupAddress;
    private String Status;

}
