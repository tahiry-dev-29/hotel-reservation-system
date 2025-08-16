package com.hotel.app.security.service;

import com.hotel.app.customer.service.CustomerUserDetailsService; // Import customer service
import com.hotel.app.user.service.UserDetailsServiceImpl; // Import staff user service
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * A composite UserDetailsService that delegates loading user details
 * to either the staff UserDetailsService or the customer UserDetailsService.
 * This resolves the ambiguity when multiple UserDetailsService beans are present.
 */
@Service
@RequiredArgsConstructor
public class DelegatingUserDetailsService implements UserDetailsService {

    private final UserDetailsServiceImpl userDetailsServiceImpl; // Staff UserDetailsService
    private final CustomerUserDetailsService customerUserDetailsService; // Customer UserDetailsService

    /**
     * Attempts to load user details by username (email) from both staff and customer services.
     * It tries the staff service first, and if the user is not found, it then tries the customer service.
     * @param username The email of the user to load.
     * @return UserDetails (either a User or Customer entity).
     * @throws UsernameNotFoundException if the user is not found in either service.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            // Try loading from staff users first
            return userDetailsServiceImpl.loadUserByUsername(username);
        } catch (UsernameNotFoundException e) {
            // If not found in staff, try loading from customers
            return customerUserDetailsService.loadUserByUsername(username);
        }
    }
}
