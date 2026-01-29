package com.example.ewate.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {

    private String userId;
    private String name;
    private String email;
    private String roleName;
    private String status;
    private LocalDateTime createdAt;
}