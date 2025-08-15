package com.hotel.app.user.service;

import com.hotel.app.security.service.JwtService;
import com.hotel.app.user.dto.AuthResponse;
import com.hotel.app.user.dto.UserInfo;
import com.hotel.app.user.dto.UserRegistrationRequest;
import com.hotel.app.user.mapper.UserMapper;
import com.hotel.app.user.model.User;
import com.hotel.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of the UserService interface.
 * Handles user registration, password encoding, and token generation.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;

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

        // Create a new User entity. JPA will handle the ID generation automatically.
        User newUser = new User();
        newUser.setFullName(request.getFullName());
        newUser.setMail(request.getMail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setImageUrl(request.getImageUrl()); // Image is optional
        newUser.setOnline(true);
        // Assign a default role for security. New registrations are typically 'VIEWER' (or 'GUEST').
        newUser.setRole(User.ROLE.VIEWER); // Set default role here!

        // Save the new user to the database. The savedUser object will now have the generated ID.
        User savedUser = userRepository.save(newUser);

        // Generate JWT token for the newly registered user
        String jwtToken = jwtService.generateToken(savedUser);

        // Map the saved User entity to a UserInfo DTO
        UserInfo userInfo = userMapper.toUserInfo(savedUser);

        // Return the authentication response with the token and user info
        return AuthResponse.builder()
                .token(jwtToken)
                .user(userInfo)
                .build();
    }
}
