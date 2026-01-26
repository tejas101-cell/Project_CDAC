package com.example.pickup_request.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusLogRequestDTO {
    private Integer requestId;
    private String status;
    private Integer updatedBy;
}

