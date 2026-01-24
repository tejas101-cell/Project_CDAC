package com.example.pickup_request.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PickupItemResponseDTO {
    private String itemName;
    private Integer quantity;
    private String remarks;
}
