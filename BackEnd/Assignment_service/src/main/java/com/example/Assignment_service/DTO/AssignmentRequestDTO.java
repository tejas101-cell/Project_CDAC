package com.example.Assignment_service.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentRequestDTO {
    private Integer requestId;
    private String collectorId;
}
