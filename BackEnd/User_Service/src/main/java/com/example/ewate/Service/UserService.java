package com.example.ewate.Service;

import com.example.ewate.DTO.RegisterRequest;
import com.example.ewate.DTO.UserResponse;

public interface UserService {

    UserResponse register(RegisterRequest request);

    UserResponse getUserById(String userId);
}
