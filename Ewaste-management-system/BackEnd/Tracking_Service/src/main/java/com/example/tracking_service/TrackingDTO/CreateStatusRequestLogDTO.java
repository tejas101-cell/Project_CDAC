package com.example.tracking_service.TrackingDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateStatusRequestLogDTO {
    private Integer requestId;
    private String status;
    private Integer updatedBy;
}
