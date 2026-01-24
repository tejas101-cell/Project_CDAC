package com.example.pickup_request.DTO;

import com.example.pickup_request.Entity.PickupItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePickupResponseDTO {
    private Integer requestId;
    private String status;
    private String message;
}
