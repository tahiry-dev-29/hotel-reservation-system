package com.hotel.app.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

/**
 * DTO for user registration requests.
 * Contains user details needed to create a new account, without the role field for security reasons.
 */
@Data
@Builder
public class UserRegistrationRequest {

    @NotNull(message = "Le nom est obligatoire.")
    private String fullName;

    @NotNull(message = "L'adresse email est obligatoire.")
    @Email(message = "L'adresse email doit être valide.")
    private String mail;

    @NotNull(message = "Le mot de passe est obligatoire.")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères.")
    private String password;

    private String imageUrl; // Optional

    private String phone; // New optional phone field
}
