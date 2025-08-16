package com.hotel.app.customer.model;

import com.hotel.app.user.model.User; // Import User.ROLE enum
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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Represents a Customer entity in the database.
 * This class maps to the 'customers' table and includes validation constraints.
 * Implements UserDetails for Spring Security authentication.
 */
@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer implements UserDetails { // Implement UserDetails

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    @NotNull(message = "Le nom complet du client est obligatoire.")
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @NotNull(message = "L'adresse email du client est obligatoire.")
    @Email(message = "L'adresse email doit être valide.")
    @Column(name = "mail", nullable = false, unique = true)
    private String mail;

    @NotNull(message = "Le mot de passe du client est obligatoire.") // Password for authentication
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @NotNull(message = "Le rôle est obligatoire.")
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private User.ROLE role; // Use User.ROLE for consistency

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
        return mail; // Using email as username for authentication
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
