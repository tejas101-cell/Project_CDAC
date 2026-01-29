package com.example.ewate.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {

    private Integer userId;
    private String name;
    private String email;
    private String roleName;
    private String status;
    private LocalDateTime createdAt;

    public void setUserId(Integer userId) { this.userId = userId; }
    public Integer getUserId() { return userId; }
    
    public void setName(String name) { this.name = name; }
    public String getName() { return name; }

    public void setEmail(String email) { this.email = email; }
    public String getEmail() { return email; }

    public void setRoleName(String roleName) { this.roleName = roleName; }
    public String getRoleName() { return roleName; }

    public void setStatus(String status) { this.status = status; }
    public String getStatus() { return status; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}