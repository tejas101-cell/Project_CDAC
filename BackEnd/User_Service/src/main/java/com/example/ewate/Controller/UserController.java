package com.example.ewate.Controller;

import com.example.ewate.DTO.RegisterRequest;
import com.example.ewate.DTO.UserResponse;
import com.example.ewate.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
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

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Update User Status
    @PutMapping("/{userId}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable String userId,
            @RequestParam String status) {
        userService.updateStatus(userId, status);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/availability")
    public ResponseEntity<Void> updateAvailability(
        @PathVariable String userId,
        @RequestParam String availability) {
    userService.updateAvailability(userId, availability);
    return ResponseEntity.ok().build();
}
}