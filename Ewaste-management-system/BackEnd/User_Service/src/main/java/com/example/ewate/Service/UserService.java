package com.example.ewate.Service;

import com.example.ewate.DTO.LoginRequest;
import com.example.ewate.DTO.RegisterRequest;
import com.example.ewate.DTO.UserResponse;

public interface UserService {

    UserResponse register(RegisterRequest request);

    UserResponse login(LoginRequest request);
    
    java.util.List<UserResponse> getAllUsers();
    
    java.util.List<UserResponse> getUsersByRole(String roleName);
    
    UserResponse updateUserStatus(Integer userId, String status);
    
    UserResponse getUserById(Integer userId);
}
