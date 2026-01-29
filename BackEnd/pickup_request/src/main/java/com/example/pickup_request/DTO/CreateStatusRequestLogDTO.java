package com.example.pickup_request.DTO;

import lombok.Data;

@Data
public class CreateStatusRequestLogDTO {
    private Integer requestId;
    private String status;
    private String updatedBy;
}
