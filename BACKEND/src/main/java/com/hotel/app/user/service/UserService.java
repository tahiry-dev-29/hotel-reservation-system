package com.hotel.app.user.service;

import com.hotel.app.user.dto.AuthResponse;
import com.hotel.app.user.dto.LoginRequest;
import com.hotel.app.user.dto.UserRegistrationRequest;

/**
 * Service interface for managing User-related operations.
 * Defines the contract for user registration and other user services.
 */
public interface UserService {

    /**
     * Registers a new user account and generates an authentication token.
     * @param request The UserRegistrationRequest containing user details.
     * @return AuthResponse containing the generated JWT token.
     */
    AuthResponse registerUser(UserRegistrationRequest request);

    /**
     * Authenticates a user based on their login credentials and generates an authentication token.
     * @param request The LoginRequest containing user's email and password.
     * @return AuthResponse containing the generated JWT token and user info.
     */
    AuthResponse loginUser(LoginRequest request);
}
