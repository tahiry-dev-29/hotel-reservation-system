package com.hotel.app.security.filters;

import com.hotel.app.security.service.JwtService;
import com.hotel.app.security.service.DelegatingUserDetailsService; // Import new delegating service
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter that intercepts incoming requests to validate JWT tokens.
 * It extracts the token, validates it, loads user details, and sets the security context.
 */
@Component
@RequiredArgsConstructor // Lombok for constructor injection of final fields
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final DelegatingUserDetailsService delegatingUserDetailsService; // Inject the specific delegating service

    /**
     * Performs the actual filtering logic.
     * @param request The HTTP request.
     * @param response The HTTP response.
     * @param filterChain The filter chain to proceed.
     * @throws ServletException If a servlet-specific error occurs.
     * @throws IOException If an I/O error occurs.
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. Check if Authorization header is present and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // Continue to the next filter
            return;
        }

        // 2. Extract JWT token
        jwt = authHeader.substring(7); // "Bearer ".length() is 7
        userEmail = jwtService.extractUsername(jwt); // Extract username (email) from token

        // 3. If email is extracted and no authentication is currently set in SecurityContext
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 4. Load UserDetails using the delegating service (it will try staff then customer)
            UserDetails userDetails = this.delegatingUserDetailsService.loadUserByUsername(userEmail);

            // 5. Validate the token against the loaded UserDetails
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // 6. If token is valid, create an authentication token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, // The authenticated principal (User or Customer entity)
                        null,        // Credentials (password), not needed for token-based auth after validation
                        userDetails.getAuthorities() // User's roles/authorities
                );
                // 7. Set authentication details (remote address, session ID etc.)
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                // 8. Set the authentication object in the SecurityContextHolder
                // This marks the user as authenticated for the current request
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // 9. Continue to the next filter in the chain
        filterChain.doFilter(request, response);
    }
}
