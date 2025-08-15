package com.hotel.app.user.controller;

import com.hotel.app.user.dto.AuthResponse;
import com.hotel.app.user.dto.LoginRequest; // Import LoginRequest
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
 * REST Controller for user authentication operations (e.g., registration and login).
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    /**
     * Handles user registration requests.
     * Registers the user and returns an AuthResponse with token and user info.
     * @param request The registration request details, validated by @Valid.
     * @return A ResponseEntity containing the AuthResponse and HTTP status CREATED.
     */
    @PostMapping // Maps POST requests to /api/auth for registration
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody UserRegistrationRequest request) {
        AuthResponse response = userService.registerUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Handles user login requests.
     * Authenticates the user and returns an AuthResponse with token and user info.
     * @param request The login request details, validated by @Valid.
     * @return A ResponseEntity containing the AuthResponse and HTTP status OK.
     */
    @PostMapping("/login") // Maps POST requests to /api/auth/login for login
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) { // @Valid triggers DTO validation
        // Call the service to authenticate the user and get the authentication response
        AuthResponse response = userService.loginUser(request);
        // Return the response with HTTP status 200 OK
        return ResponseEntity.ok(response);
    }
}
