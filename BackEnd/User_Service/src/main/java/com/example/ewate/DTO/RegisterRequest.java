package com.example.ewate.DTO;

import lombok.Data;

@Data
public class RegisterRequest {

    private String name;
    private String email;
    private String phone;
    private String address;

    // User / Admin / Collector / Recycling_centre
    private String roleName;
}