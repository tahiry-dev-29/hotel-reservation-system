package com.hotel.app.user.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue; // Import for @GeneratedValue
import jakarta.persistence.GenerationType; // Import for GenerationType
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Represents a User entity in the database.
 * This class maps to the 'users' table and includes validation constraints.
 * Implements UserDetails for Spring Security integration.
 * Lombok handles constructors, getters, and setters.
 * ID generation is now handled automatically by JPA.
 */
@Entity
@Table(name = "users")
@Data // Generates getters, setters, toString, equals, and hashCode methods
@NoArgsConstructor // Generates a no-argument constructor
@AllArgsConstructor // Generates an all-argument constructor (useful for JPA and tests)
public class User implements UserDetails {

    @Id // Marks this field as the primary key
    // Instructs JPA to generate the ID automatically using a UUID strategy
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, unique = true) // Maps to 'id' column, ensures it's not null and unique
    private String id;

    @NotNull(message = "Le nom est obligatoire.") // Ensures the full name is not null
    @Column(name = "full_name", nullable = false) // Maps to 'full_name' column
    private String fullName;

    @NotNull(message = "L'adresse email est obligatoire.") // Ensures the email is not null
    @Email(message = "L'adresse email doit être valide.") // Ensures the email format is valid
    @Column(name = "mail", nullable = false, unique = true) // Maps to 'mail' column, must be unique
    private String mail;

    @NotNull(message = "Le mot de passe est obligatoire.") 
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères.")
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "image_url") // imageUrl is optional
    private String imageUrl;

    @Column(name = "online", nullable = false)
    private boolean online;

    /**
     * Enum for user roles: ADMIN, EDITOR, VIEWER.
     */
    public enum ROLE {
        ADMIN, // Full administrative access, manages users and system settings
        EDITOR, // Can create, read, update specific data (e.g., manage bookings, rooms)
        VIEWER // Can only read data (e.g., view room availability, own bookings)
    }

    @NotNull(message = "Le rôle est obligatoire.")
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private ROLE role;

    // --- UserDetails interface methods ---
    // These methods are crucial for Spring Security and cannot be removed by Lombok directly

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Returns a single authority based on the user's ROLE, prefixed with "ROLE_"
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        // The email is used as the username for authentication
        return mail;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Account is always non-expired by default
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Account is never locked by default
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credentials are always non-expired by default
    }

    @Override
    public boolean isEnabled() {
        return true; // User is always enabled by default
    }
}
