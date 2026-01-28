package com.example.Assignment_service.AssignmentDTO;

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
