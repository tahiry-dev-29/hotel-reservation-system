package com.hotel.app.security.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.hotel.app.security.filters.JwtAuthenticationFilter;
import com.hotel.app.user.service.UserDetailsServiceImpl;
import com.hotel.app.customer.service.CustomerUserDetailsService;
import com.hotel.app.security.service.DelegatingUserDetailsService;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final CustomerUserDetailsService customerUserDetailsService;

    private static final String[] PUBLIC_ENDPOINTS = {
            "/",
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/**",
            "/api/customer-auth/register",
            "/api/customer-auth/login",
            "/api/customer-auth/**",
            // Public access for viewing rooms
            "/api/rooms",          // Allow GET all rooms publicly
            "/api/rooms/*",        // Allow GET single room publicly
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
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll() // All defined public endpoints are allowed
                        // User Management (staff roles only - ADMIN, EDITOR)
                        // Specific permissions handled by @PreAuthorize in UserController
                        .requestMatchers("/api/users/**").authenticated() 
                        
                        // Customer Management:
                        // Staff (ADMIN, EDITOR) can manage all customers.
                        // Customers (CUSTOMER) can read/update their own profile via @PreAuthorize in CustomerController.
                        .requestMatchers("/api/customers/**").authenticated()

                        // Room Management:
                        // Other room operations (POST, PUT, DELETE, image management) require authentication and specific roles
                        // GET /api/rooms and GET /api/rooms/{id} are handled by PUBLIC_ENDPOINTS.
                        .requestMatchers("/api/rooms/**").authenticated() // All other /api/rooms paths require authentication

                        // Invoice Management:
                        // Staff (ADMIN, EDITOR) can manage all invoices.
                        // Customers (CUSTOMER) can view their own invoices via @PreAuthorize in InvoiceController.
                        .requestMatchers("/api/invoices/**").authenticated()

                        // Payment Management:
                        // Staff (ADMIN, EDITOR) can manage all payments.
                        // Customers (CUSTOMER) can view payments for their own invoices via @PreAuthorize in PaymentController.
                        .requestMatchers("/api/payments/**").authenticated()

                        // Inventory Management (ADMIN, EDITOR only)
                        .requestMatchers("/api/inventory/**").hasAnyRole("ADMIN", "EDITOR")
                        
                        .anyRequest().authenticated()) // All other requests require authentication
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public DaoAuthenticationProvider staffAuthenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsServiceImpl);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public DaoAuthenticationProvider customerAuthenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customerUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
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
