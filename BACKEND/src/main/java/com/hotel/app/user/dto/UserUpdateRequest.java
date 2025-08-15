package com.hotel.app.user.dto;

import com.hotel.app.user.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

/**
 * DTO for user update requests.
 * All fields are optional (no @NotNull here) as a user might only update specific information.
 */
@Data
@Builder
public class UserUpdateRequest {
    private String fullName;
    
    @Email(message = "L'adresse email doit être valide.") // Email format validation
    private String mail; // Note: Changing email usually requires re-verification

    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères.") // Password length validation
    private String password; // Password is optional for update, will be hashed if provided

    private String imageUrl; // Optional, represents the URL of the new image
    private Boolean online; // Use Boolean for nullable status
    private String phone; // Optional

    private User.ROLE role; // Only an ADMIN should be able to update this (handled by security)
}
