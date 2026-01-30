package com.example.Recycling_service.RecyclingDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryDTO {
    private Integer requestId;
    private Integer collectorId;
    private Integer recyclerId;
}
