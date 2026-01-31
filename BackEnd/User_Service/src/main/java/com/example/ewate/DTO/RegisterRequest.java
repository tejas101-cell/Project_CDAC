package com.example.ewate.DTO;

import lombok.Data;

@Data
public class RegisterRequest {

    private String userId;
    private String name;
    private String email;
    private String password;

    // User / Admin / Collector / Recycling_centre
    private String roleName;
}