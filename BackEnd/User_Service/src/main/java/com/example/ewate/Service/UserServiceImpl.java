package com.example.ewate.Service;

import com.example.ewate.DTO.LoginRequest;
import com.example.ewate.DTO.LoginResponse;
import com.example.ewate.DTO.RegisterRequest;
import com.example.ewate.DTO.UserResponse;
import com.example.ewate.Entity.Role;
import com.example.ewate.Entity.User;
import com.example.ewate.Repository.RoleRepository;
import com.example.ewate.Repository.UserRepository;
import com.example.ewate.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;

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
        user.setPassword("IDP_MANAGED");
        user.setStatus("Active");
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    // ✅ FIXED: return type changed
    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not registered"));

        // ✅ Generate JWT
        String token = jwtUtil.generateToken(
                user.getUserId(),
                user.getEmail(),
                user.getRole().getRoleName()
        );

        UserResponse userResponse = mapToResponse(user);

        return new LoginResponse(token, userResponse);
    }

    @Override
    public UserResponse getUserById(Integer userId) {
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
