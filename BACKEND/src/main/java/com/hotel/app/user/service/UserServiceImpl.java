package com.hotel.app.user.service;

import com.hotel.app.security.service.JwtService;
import com.hotel.app.user.dto.AuthResponse;
import com.hotel.app.user.dto.LoginRequest; // Import LoginRequest
import com.hotel.app.user.dto.UserRegistrationRequest;
import com.hotel.app.user.mapper.UserMapper;
import com.hotel.app.user.model.User;
import com.hotel.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager; // Import AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Import for authentication
import org.springframework.security.core.Authentication; // Import Authentication
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of the UserService interface.
 * Handles user registration, login, password encoding, and token generation.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager; // Inject AuthenticationManager

    /**
     * Registers a new user account.
     * Checks if email already exists, hashes password, saves user, and generates JWT token.
     * Automatically assigns a default role to the new user for security.
     * @param request The UserRegistrationRequest containing user details.
     * @return AuthResponse containing the generated JWT token and user info.
     * @throws IllegalStateException if a user with the given email already exists.
     */
    @Override
    @Transactional
    public AuthResponse registerUser(UserRegistrationRequest request) {
        if (userRepository.existsByMail(request.getMail())) {
            throw new IllegalStateException("Un compte avec cet email existe déjà.");
        }

        User newUser = new User();
        // ID generation is handled by JPA's @GeneratedValue(strategy = GenerationType.UUID)
        newUser.setFullName(request.getFullName());
        newUser.setMail(request.getMail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setImageUrl(request.getImageUrl());
        newUser.setOnline(true);
        newUser.setRole(User.ROLE.VIEWER); // Set default role here!

        User savedUser = userRepository.save(newUser);

        String jwtToken = jwtService.generateToken(savedUser);
        
        // Convert the saved user entity to UserInfo DTO
        return AuthResponse.builder()
                .token(jwtToken)
                .user(userMapper.toUserInfo(savedUser))
                .build();
    }

    /**
     * Authenticates a user based on their login credentials.
     * If authentication is successful, a JWT token is generated and returned with user info.
     * @param request The LoginRequest containing user's email and password.
     * @return AuthResponse containing the generated JWT token and user info.
     * @throws org.springframework.security.core.AuthenticationException if authentication fails.
     */
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
                .user(userMapper.toUserInfo(authenticatedUser))
                .build();
    }
}
