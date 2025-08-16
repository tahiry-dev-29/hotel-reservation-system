package com.hotel.app.customer.controller;

import com.hotel.app.user.dto.AuthResponse; // Reuse AuthResponse
import com.hotel.app.user.dto.LoginRequest; // Reuse LoginRequest
import com.hotel.app.customer.dto.CustomerRegistrationRequest;
import com.hotel.app.customer.service.CustomerAuthService; // Inject CustomerAuthService
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for public customer authentication operations (registration and login).
 */
@RestController
@RequestMapping("/api/customer-auth") // New base path for customer authentication
@RequiredArgsConstructor
public class CustomerAuthController {

    private final CustomerAuthService customerAuthService;

    /**
     * Handles customer registration requests.
     * @param request The CustomerRegistrationRequest details, validated by @Valid.
     * @return A ResponseEntity containing the AuthResponse and HTTP status CREATED.
     */
    @PostMapping("/register") // Public endpoint for customer registration
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody CustomerRegistrationRequest request) {
        AuthResponse response = customerAuthService.registerCustomer(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Handles customer login requests.
     * @param request The LoginRequest containing customer's email and password.
     * @return A ResponseEntity containing the AuthResponse and HTTP status OK.
     */
    @PostMapping("/login") // Public endpoint for customer login
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = customerAuthService.loginCustomer(request);
        return ResponseEntity.ok(response);
    }
}
