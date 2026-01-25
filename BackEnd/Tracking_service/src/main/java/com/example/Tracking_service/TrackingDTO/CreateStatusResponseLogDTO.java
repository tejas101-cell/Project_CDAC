package com.example.Tracking_service.TrackingDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateStatusResponseLogDTO {
    private String status;
    private LocalDateTime updatedOn;
}
