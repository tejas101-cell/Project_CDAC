package com.example.ewate.Service;

import com.example.ewate.DTO.RegisterRequest;
import com.example.ewate.DTO.UserResponse;
import java.util.List;

public interface UserService {

    UserResponse register(RegisterRequest request);

    UserResponse getUserById(String userId);

    void updateStatus(String userId, String status);

    void updateAvailability(String userId, String availability);

    List<UserResponse> getAllUsers();
}
