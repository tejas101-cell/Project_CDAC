package com.example.ewate.Controller;

import com.example.ewate.DTO.LoginRequest;
import com.example.ewate.DTO.LoginResponse;
import com.example.ewate.DTO.RegisterRequest;
import com.example.ewate.DTO.UserResponse;
import com.example.ewate.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Register User
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(userService.register(request));
    }

    // Login User
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(userService.login(request));
    }

    // Get User By ID
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(userService.getUserById(userId));
    }
}
