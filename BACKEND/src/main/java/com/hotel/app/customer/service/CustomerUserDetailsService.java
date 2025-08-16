package com.hotel.app.customer.service;

import com.hotel.app.customer.model.Customer;
import com.hotel.app.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Custom UserDetailsService for loading Customer entities by their email (username).
 * This service is used by Spring Security's AuthenticationManager to authenticate customers.
 */
@Service
@RequiredArgsConstructor
public class CustomerUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;

    /**
     * Locates the customer based on the username (email).
     * @param username The email address of the customer.
     * @return The Customer entity found, which implements UserDetails.
     * @throws UsernameNotFoundException if the customer could not be found.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return customerRepository.findByMail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Client non trouvé avec l'email: " + username));
    }
}
