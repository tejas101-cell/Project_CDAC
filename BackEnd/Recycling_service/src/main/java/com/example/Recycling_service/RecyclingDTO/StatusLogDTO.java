package com.example.Recycling_service.RecyclingDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusLogDTO {
    private Integer requestId;
    private String status;
    private Integer updatedBy;
}
