package com.hotel.app.user.controller;

import com.hotel.app.user.dto.AuthResponse;
import com.hotel.app.user.dto.UserRegistrationRequest;
import com.hotel.app.user.service.UserService;
import jakarta.validation.Valid; // For validating the DTO
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for user authentication operations (e.g., registration).
 */
@RestController // Marks this class as a REST controller
@RequestMapping("/api/auth") // Base path for all endpoints in this controller
@RequiredArgsConstructor // Lombok to auto-inject final dependencies via constructor
public class AuthController {

    private final UserService userService; // Inject the UserService

    /**
     * Handles user registration requests.
     * Takes a UserRegistrationRequest DTO, registers the user, and returns an AuthResponse with token and user info.
     * @param request The registration request details, validated by @Valid.
     * @return A ResponseEntity containing the AuthResponse and HTTP status CREATED.
     */
    @PostMapping // Maps POST requests to /api/auth (no /register needed)
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody UserRegistrationRequest request) { // @Valid triggers DTO validation
        // Call the service to register the user and get the authentication response
        AuthResponse response = userService.registerUser(request);
        // Return the response with HTTP status 201 Created
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // TODO: Add a login endpoint here later (e.g., @PostMapping("/login"))
    // This method would handle user login, authenticate credentials, and return a token + user info.
}
