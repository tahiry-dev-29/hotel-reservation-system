package com.hotel.app.user.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    @NotNull(message = "Le nom est obligatoire.")
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @NotNull(message = "L'adresse email est obligatoire.")
    @Email(message = "L'adresse email doit être valide.")
    @Column(name = "mail", nullable = false, unique = true)
    private String mail;

    @NotNull(message = "Le mot de passe est obligatoire.")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères.")
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "image_url") // imageUrl is optional
    private String imageUrl;

    @Column(name = "online", nullable = false)
    private boolean online;

    @Column(name = "phone") // New phone field, optional by default
    private String phone;

    /**
     * Enum for user roles: ADMIN, EDITOR, VIEWER.
     */
    public enum ROLE {
        ADMIN, // Full administrative access, manages users and system settings
        EDITOR, // Can create, read, update specific data (e.g., manage bookings, rooms)
        VIEWER, // Can only read data (e.g., view room availability, own bookings)
        CUSTOMER // External customer, can manage their own profile and bookings, view their invoices.

    }

    @NotNull(message = "Le rôle est obligatoire.")
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private ROLE role;

    // --- UserDetails interface methods ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return mail;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
