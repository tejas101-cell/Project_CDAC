package com.example.ewate.Controller;

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

    // Register User (Note: In Keycloak setup, this might be triggered by a webhook or direct sync)
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(userService.register(request));
    }

    // Get User By ID
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable String userId) { // Updated from Integer to String

        return ResponseEntity.ok(userService.getUserById(userId));
    }
}