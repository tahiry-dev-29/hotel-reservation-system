package com.hotel.app.customer.service;

import com.hotel.app.security.service.JwtService;
import com.hotel.app.user.dto.AuthResponse;
import com.hotel.app.user.dto.LoginRequest;
import com.hotel.app.user.model.User; // For User.ROLE enum
import com.hotel.app.customer.dto.CustomerRegistrationRequest;
import com.hotel.app.customer.mapper.CustomerMapper; // Import CustomerMapper
import com.hotel.app.customer.model.Customer; // Import Customer entity
import com.hotel.app.customer.repository.CustomerRepository; // Import CustomerRepository
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for handling customer authentication operations (registration and login).
 */
@Service
@RequiredArgsConstructor
public class CustomerAuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomerMapper customerMapper; // Inject CustomerMapper

    /**
     * Registers a new customer account.
     * @param request The CustomerRegistrationRequest containing customer details.
     * @return AuthResponse containing the generated JWT token and customer info.
     * @throws IllegalStateException if a customer with the given email already exists.
     */
    @Transactional
    public AuthResponse registerCustomer(CustomerRegistrationRequest request) {
        if (customerRepository.existsByMail(request.getMail())) {
            throw new IllegalStateException("Un compte client avec cet email existe déjà.");
        }

        Customer newCustomer = new Customer();
        newCustomer.setFullName(request.getFullName());
        newCustomer.setMail(request.getMail());
        newCustomer.setPassword(passwordEncoder.encode(request.getPassword()));
        newCustomer.setPhone(request.getPhone());
        newCustomer.setAddress(request.getAddress());
        newCustomer.setRole(User.ROLE.CUSTOMER); // Assign CUSTOMER role

        Customer savedCustomer = customerRepository.save(newCustomer);

        String jwtToken = jwtService.generateToken(savedCustomer); // Generates token from UserDetails
        
        return AuthResponse.builder()
                .token(jwtToken)
                .user(customerMapper.toUserResponse(savedCustomer)) // Map Customer to UserResponse (reusing UserResponse DTO, perhaps rename to AuthUserResponse)
                .build();
    }

    /**
     * Authenticates a customer based on their login credentials.
     * @param request The LoginRequest containing customer's email and password.
     * @return AuthResponse containing the generated JWT token and customer info.
     * @throws org.springframework.security.core.AuthenticationException if authentication fails.
     */
    public AuthResponse loginCustomer(LoginRequest request) {
        // Authenticate the customer with Spring Security's AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getMail(),
                        request.getPassword()
                )
        );

        // If authentication is successful, get the authenticated UserDetails (which is our Customer entity)
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Customer authenticatedCustomer = (Customer) userDetails; // Cast to Customer

        String jwtToken = jwtService.generateToken(authenticatedCustomer); // Generates token from UserDetails

        return AuthResponse.builder()
                .token(jwtToken)
                .user(customerMapper.toUserResponse(authenticatedCustomer)) // Map Customer to UserResponse
                .build();
    }
}
