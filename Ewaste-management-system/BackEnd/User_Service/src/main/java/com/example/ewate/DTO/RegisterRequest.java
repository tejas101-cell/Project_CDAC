package com.example.ewate.DTO;

import lombok.Data;

@Data
public class RegisterRequest {

    private String name;
    private String email;

    // User / Admin / Collector / Recycling_centre
    private String roleName;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
}