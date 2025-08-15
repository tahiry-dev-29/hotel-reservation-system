package com.hotel.app.user.service;

import com.hotel.app.user.dto.AuthResponse;
import com.hotel.app.user.dto.LoginRequest;
import com.hotel.app.user.dto.UserRegistrationRequest;
import com.hotel.app.user.dto.UserResponse; // Changed from UserInfo
import com.hotel.app.user.dto.UserUpdateRequest; // New DTO
import org.springframework.web.multipart.MultipartFile; // For image upload

import java.util.List;

/**
 * Service interface for managing User-related operations.
 * Defines the contract for user registration, login, and CRUD operations.
 */
public interface UserService {

    // Authentication methods
    AuthResponse registerUser(UserRegistrationRequest request);
    AuthResponse loginUser(LoginRequest request);

    // CRUD operations
    UserResponse getUserById(String id);
    List<UserResponse> getAllUsers();
    UserResponse updateUser(String id, UserUpdateRequest request);
    void deleteUser(String id);

    // Image upload method (returns the URL/path of the stored image)
    String uploadUserImage(String userId, MultipartFile file);
}
