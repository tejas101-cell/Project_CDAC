package com.example.ewate.Service;

import com.example.ewate.DTO.RegisterRequest;
import com.example.ewate.DTO.UserResponse;
import com.example.ewate.Entity.Role;
import com.example.ewate.Entity.User;
import com.example.ewate.Repository.RoleRepository;
import com.example.ewate.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public UserResponse register(RegisterRequest request) {

        userRepository.findByEmail(request.getEmail())
                .ifPresent(u -> {
                    throw new RuntimeException("User already exists");
                });

        Role role = roleRepository.findByRoleName(request.getRoleName());

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(role);
        user.setStatus("ACTIVE");
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Override
    public UserResponse getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    private UserResponse mapToResponse(User user) {

        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRoleName(user.getRole().getRoleName());
        response.setStatus(user.getStatus());
        response.setCreatedAt(user.getCreatedAt());

        return response;
    }
}
