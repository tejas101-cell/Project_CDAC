package com.example.ewate.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {

    private Integer userId;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String roleName;
    private String availabilityStatus;
    private String status;
    private LocalDateTime createdAt;
}