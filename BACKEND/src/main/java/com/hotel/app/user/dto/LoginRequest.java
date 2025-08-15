package com.hotel.app.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

/**
 * DTO for user login requests.
 * Contains user credentials needed for authentication.
 */
@Data
@Builder // Lombok annotation to provide a builder pattern for object creation
public class LoginRequest {

    @NotNull(message = "L'adresse email est obligatoire.") // Email cannot be null
    @Email(message = "L'adresse email doit être valide.") // Email must be in a valid format
    private String mail;

    @NotNull(message = "Le mot de passe est obligatoire.") // Password cannot be null
    private String password;
}
