package com.example.ewate.Service;

import com.example.ewate.DTO.LoginRequest;
import com.example.ewate.DTO.RegisterRequest;
import com.example.ewate.DTO.UserResponse;
import com.example.ewate.Entity.Role;
import com.example.ewate.Entity.User;
import com.example.ewate.Repository.RoleRepository;
import com.example.ewate.Repository.UserRepository;
import com.example.ewate.Service.UserService;
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
        System.out.println("Register attempt for email: " + request.getEmail());

        userRepository.findByEmailIgnoreCase(request.getEmail())
                .ifPresent(u -> {
                    throw new RuntimeException("User already exists");
                });

        Role role = roleRepository.findByRoleNameIgnoreCase(request.getRoleName())
                .orElseThrow(() -> {
                    System.out.println("Role not found: " + request.getRoleName());
                   return new RuntimeException("Role not found: " + request.getRoleName());
                });

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(role);

        // Identity Provider will manage authentication
        user.setPassword("IDP_MANAGED");

        user.setStatus("Pending");
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Override
    public UserResponse login(LoginRequest request) {
        System.out.println("Login attempt for email: " + request.getEmail());

        // HARDCODED ADMIN CHECK
        if ("admin@admin.com".equalsIgnoreCase(request.getEmail())) {
            // Check password
            if (!"1234".equals(request.getPassword())) {
                throw new RuntimeException("Invalid credentials");
            }

            UserResponse adminResponse = new UserResponse();
            adminResponse.setUserId(999); // Dummy ID
            adminResponse.setName("admin@admin.com");
            adminResponse.setEmail("admin@admin.com");
            adminResponse.setRoleName("Admin");
            adminResponse.setStatus("Approved");
            adminResponse.setCreatedAt(LocalDateTime.now());
            return adminResponse;
        }

        // User already authenticated by IdP
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not registered"));

        if (!"Approved".equalsIgnoreCase(user.getStatus())) {
             throw new RuntimeException("Your account is pending approval. Please wait for admin approval.");
        }

        return mapToResponse(user);
    }

    @Override
    public java.util.List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }



    @Override
    public UserResponse updateUserStatus(Integer userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    @Override
    public UserResponse getUserById(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    @Override
    public java.util.List<UserResponse> getUsersByRole(String roleName) {
        return userRepository.findByRole_RoleName(roleName).stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
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