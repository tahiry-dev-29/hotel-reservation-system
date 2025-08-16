package com.hotel.app.security.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager; // Import ProviderManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService; // Keep for parameter type
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.hotel.app.security.filters.JwtAuthenticationFilter;
import com.hotel.app.user.service.UserDetailsServiceImpl; // Keep import for bean definition
import com.hotel.app.customer.service.CustomerUserDetailsService; // Keep import for bean definition
import com.hotel.app.security.service.DelegatingUserDetailsService; // Import the new delegating service


import java.util.Arrays;
import java.util.List; // Import List

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // IMPORTANT: Enable method-level security with @PreAuthorize
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    // We now inject the specific UserDetailsService implementations for the DaoAuthenticationProviders.
    // They are no longer directly injected into SecurityConfig's constructor for use in the filter,
    // but rather explicitly passed to their respective DaoAuthenticationProvider beans.
    private final UserDetailsServiceImpl userDetailsServiceImpl; // Inject staff UserDetailsService
    private final CustomerUserDetailsService customerUserDetailsService; // Inject customer UserDetailsService


    private static final String[] PUBLIC_ENDPOINTS = {
            "/",
            // Public endpoints for staff authentication (register/login)
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/**",
            // Public endpoints for customer authentication (register/login)
            "/api/customer-auth/register",
            "/api/customer-auth/login",
            "/api/customer-auth/**", // All customer auth paths are public
            "/webjars/**",
            // You might need to add paths for serving static image files here if they are in 'uploads' and accessed directly
            // e.g., "/uploads/**" if you configure a resource handler in Spring MVC.
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers("/api/users/**").authenticated() // User Management (staff)
                        // Customer Management (staff can manage all customers, customers manage their own)
                        // We will add specific @PreAuthorize rules in the CustomerController for customer's own access.
                        .requestMatchers("/api/customers/**").authenticated()
                        .requestMatchers("/api/rooms").hasAnyRole("ADMIN", "EDITOR", "VIEWER") // View all rooms
                        .requestMatchers("/api/rooms/{id}").hasAnyRole("ADMIN", "EDITOR", "VIEWER") // View single room
                        .requestMatchers("/api/rooms/**").authenticated() // Other room operations protected by @PreAuthorize
                        // Invoice Management (ADMIN, EDITOR, CUSTOMER for their own)
                        .requestMatchers("/api/invoices/**").authenticated()
                        // Payment Management (ADMIN, EDITOR, CUSTOMER for their own)
                        .requestMatchers("/api/payments/**").authenticated()
                        .requestMatchers("/api/inventory/**").hasAnyRole("ADMIN", "EDITOR") // Inventory Management
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // The AuthenticationProvider is now configured via the composite AuthenticationManager bean below.
                // This line is no longer needed as the AuthenticationManager handles the delegation.
                // .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    // Define multiple AuthenticationProviders for different UserDetailsService implementations
    // These providers will be used by the AuthenticationManager for login (password authentication)
    @Bean
    public DaoAuthenticationProvider staffAuthenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsServiceImpl); // Uses staff UserDetailsService
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public DaoAuthenticationProvider customerAuthenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customerUserDetailsService); // Uses customer UserDetailsService
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Create a composite AuthenticationManager that tries multiple providers
    // This AuthenticationManager is used for the /login endpoints
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        // Return a ProviderManager that can delegate to multiple DaoAuthenticationProviders
        return new ProviderManager(List.of(staffAuthenticationProvider(), customerAuthenticationProvider()));
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "X-Requested-With",
                "Cache-Control",
                "Access-Control-Allow-Headers",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
