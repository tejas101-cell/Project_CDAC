package com.example.ewate.Service;

import com.example.ewate.DTO.RegisterRequest;
import com.example.ewate.DTO.UserResponse;
import com.example.ewate.Entity.Role;
import com.example.ewate.Entity.User;
import com.example.ewate.Repository.RoleRepository;
import com.example.ewate.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import jakarta.ws.rs.core.Response;
import java.util.Collections;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

@Override
public UserResponse register(RegisterRequest request) {
    System.out.println("=== REGISTRATION STARTED for: " + request.getEmail() + " ===");
    
    try {
        // 1. Check if user already exists in Local MySQL
        java.util.Optional<User> existing = userRepository.findByEmail(request.getEmail());
        if (existing.isPresent()) {
            System.out.println("UserServiceImpl: User already exists in MySQL, returning existing.");
            return mapToResponse(existing.get());
        }

        String keycloakUserId = request.getUserId();

        // 2. IF NO USER ID PROVIDED (Manual registration from Website Form)
        if (keycloakUserId == null || keycloakUserId.isEmpty()) {
            System.out.println("UserServiceImpl: No UserID provided. Creating new account in Keycloak for: " + request.getEmail());
            
            String serverUrl = System.getenv("KEYCLOAK_AUTH_SERVER_URL");
            System.out.println("UserServiceImpl: KEYCLOAK_AUTH_SERVER_URL = " + serverUrl);
            if (serverUrl == null || serverUrl.isEmpty()) {
                serverUrl = "http://localhost:8085";
            }
            System.out.println("UserServiceImpl: Using Keycloak URL: " + serverUrl);

            Keycloak keycloak = KeycloakBuilder.builder()
                    .serverUrl(serverUrl)
                    .realm("ewaste-realm")
                    .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                    .clientId("admin-cli-sync")
                    .clientSecret("HEJ7qPMxf0pccsd7MBMA1QkHVic2v8JD")
                    .build();

            System.out.println("UserServiceImpl: Keycloak client built successfully");

            UserRepresentation userRep = new UserRepresentation();
            userRep.setEnabled(true);
            userRep.setUsername(request.getEmail());
            userRep.setEmail(request.getEmail());
            userRep.setFirstName(request.getName());

            CredentialRepresentation passwordCred = new CredentialRepresentation();
            passwordCred.setTemporary(false);
            passwordCred.setType(CredentialRepresentation.PASSWORD);
            passwordCred.setValue(request.getPassword());
            userRep.setCredentials(Collections.singletonList(passwordCred));

            System.out.println("UserServiceImpl: Attempting to create user in Keycloak...");
            Response response = keycloak.realm("ewaste-realm").users().create(userRep);
            System.out.println("UserServiceImpl: Keycloak response status: " + response.getStatus());

            if (response.getStatus() == 201) {
                keycloakUserId = CreatedResponseUtil.getCreatedId(response);
                System.out.println("UserServiceImpl: User created with ID: " + keycloakUserId);
                // Assign Role in Keycloak
                System.out.println("UserServiceImpl: Assigning role: " + request.getRoleName().toUpperCase());
                RoleRepresentation realmRole = keycloak.realm("ewaste-realm").roles().get(request.getRoleName().toUpperCase()).toRepresentation();
                keycloak.realm("ewaste-realm").users().get(keycloakUserId).roles().realmLevel().add(Collections.singletonList(realmRole));
                System.out.println("UserServiceImpl: Keycloak user created and role assigned: " + keycloakUserId);
            } else if (response.getStatus() == 409) {
                // User already exists in Keycloak! Find their ID instead of crashing
                keycloakUserId = keycloak.realm("ewaste-realm").users().search(request.getEmail()).get(0).getId();
                System.out.println("UserServiceImpl: User existed in Keycloak, found ID: " + keycloakUserId);
            } else {
                String errorBody = response.readEntity(String.class);
                System.out.println("UserServiceImpl: Keycloak error body: " + errorBody);
                throw new RuntimeException("Keycloak creation failed! Status: " + response.getStatus() + ", Body: " + errorBody);
            }
        }

        // 3. SAVE TO LOCAL DATABASE
        System.out.println("UserServiceImpl: Syncing Keycloak User to MySQL: " + request.getEmail());
    String roleNameUpper = request.getRoleName().toUpperCase();
    Role localRole = roleRepository.findByRoleName(roleNameUpper);
    if (localRole == null) {
        System.out.println("UserServiceImpl: Role " + roleNameUpper + " not found in MySQL. Creating it...");
        localRole = new Role();
        localRole.setRoleName(roleNameUpper);
        localRole = roleRepository.save(localRole);
    }

    User user = new User();
    user.setUserId(keycloakUserId); // Sync IDs!
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setRole(localRole);
    user.setStatus("Approved");
    user.setAvailability("AVAILABLE");
    user.setCreatedAt(LocalDateTime.now());
    user.setPassword("KEYCLOAK_MANAGED");

    User savedUser = userRepository.save(user);
        System.out.println("=== REGISTRATION SUCCESSFUL for: " + request.getEmail() + " ===");
        return mapToResponse(savedUser);
    } catch (Exception e) {
        System.out.println("=== REGISTRATION FAILED for: " + request.getEmail() + " ===");
        System.out.println("Exception type: " + e.getClass().getName());
        System.out.println("Exception message: " + e.getMessage());
        e.printStackTrace();
        throw new RuntimeException("Registration failed: " + e.getMessage(), e);
    }
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
        response.setAvailability(user.getAvailability());
        response.setRoleName(user.getRole().getRoleName());
        response.setStatus(user.getStatus() != null ? user.getStatus() : "Active");
        response.setCreatedAt(user.getCreatedAt());

        return response;
    }

    @Override
    public void updateStatus(String userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        userRepository.save(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void updateAvailability(String userId, String availability) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    user.setAvailability(availability);
    userRepository.save(user);
}
}
