package com.hotel.app.user.service;

import com.hotel.app.security.service.JwtService;
import com.hotel.app.storage.service.StorageService;
import com.hotel.app.user.dto.AuthResponse;
import com.hotel.app.user.dto.LoginRequest;
import com.hotel.app.user.dto.UserRegistrationRequest;
import com.hotel.app.user.dto.UserResponse;
import com.hotel.app.user.dto.UserUpdateRequest;
import com.hotel.app.user.mapper.UserMapper;
import com.hotel.app.user.model.User;
import com.hotel.app.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the UserService interface.
 * Handles user registration, login, and CRUD operations for users.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final StorageService storageService; // Inject StorageService

    // --- Authentication Methods ---

    @Override
    @Transactional
    public AuthResponse registerUser(UserRegistrationRequest request) {
        if (userRepository.existsByMail(request.getMail())) {
            throw new IllegalStateException("Un compte avec cet email existe déjà.");
        }

        User newUser = new User();
        newUser.setFullName(request.getFullName());
        newUser.setMail(request.getMail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setImageUrl(request.getImageUrl()); // Optional
        newUser.setOnline(true);
        newUser.setPhone(request.getPhone()); // Set optional phone
        newUser.setRole(User.ROLE.VIEWER); // Default role for new registrations

        User savedUser = userRepository.save(newUser);

        String jwtToken = jwtService.generateToken(savedUser);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .user(userMapper.toUserResponse(savedUser)) // Use toUserResponse
                .build();
    }

    @Override
    public AuthResponse loginUser(LoginRequest request) {
        // Authenticate the user with Spring Security's AuthenticationManager
        // This will use UserDetailsServiceImpl and PasswordEncoder internally
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getMail(),    // The username (email)
                        request.getPassword() // The raw password
                )
        );

        // If authentication is successful, get the authenticated UserDetails
        // The principal object will be our custom User entity because UserDetailsServiceImpl returns it.
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Convert UserDetails back to our User entity to access custom fields like role, id, etc.
        // This cast is safe because UserDetailsServiceImpl is configured to load our User entity.
        User authenticatedUser = (User) userDetails;

        // Generate JWT token for the authenticated user
        String jwtToken = jwtService.generateToken(authenticatedUser);

        // Convert the authenticated user entity to UserInfo DTO
        return AuthResponse.builder()
                .token(jwtToken)
                .user(userMapper.toUserResponse(authenticatedUser)) // Use toUserResponse
                .build();
    }

    // --- CRUD Operations ---

    @Override
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'ID: " + id));
        return userMapper.toUserResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse updateUser(String id, UserUpdateRequest request) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'ID: " + id));

        // Update fields if they are provided in the request
        if (request.getFullName() != null) {
            existingUser.setFullName(request.getFullName());
        }
        if (request.getMail() != null) {
            // Add a check if new email already exists for another user
            if (!request.getMail().equals(existingUser.getMail()) && userRepository.existsByMail(request.getMail())) {
                throw new IllegalStateException("L'adresse email est déjà utilisée par un autre compte.");
            }
            existingUser.setMail(request.getMail());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getImageUrl() != null) {
            existingUser.setImageUrl(request.getImageUrl());
        }
        if (request.getOnline() != null) { // Use getOnline() for Boolean
            existingUser.setOnline(request.getOnline());
        }
        if (request.getPhone() != null) {
            existingUser.setPhone(request.getPhone());
        }
        if (request.getRole() != null) {
            existingUser.setRole(request.getRole());
        }

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("Utilisateur non trouvé avec l'ID: " + id);
        }
        userRepository.deleteById(id);
    }

    // --- Image Upload Method ---

    @Override
    public String uploadUserImage(String userId, MultipartFile file) {
        // First, store the file and get its unique filename/path
        String storedFilename = storageService.store(file);

        if (storedFilename == null) {
            // If no file was uploaded (e.g., empty file), return null or throw specific exception.
            // In this case, it means no image URL to update, so we can return null.
            return null;
        }

        // Then, update the user's imageUrl field with this filename
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'ID: " + userId));
        
        user.setImageUrl(storedFilename); // Update imageUrl
        userRepository.save(user); // Save the updated user

        return storedFilename; // Return the new image URL (filename)
    }
}
