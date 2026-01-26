package com.example.ewate.DTO;

import lombok.Data;

@Data
public class RegisterRequest {

    private String name;
    private String email;

    // User / Admin / Collector / Recycling_centre
    private String roleName;
}