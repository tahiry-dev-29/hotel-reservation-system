package com.hotel.app.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

/**
 * DTO for customer registration requests.
 * Contains customer details needed to create a new customer entry.
 */
@Data
@Builder
public class CustomerRegistrationRequest {

    @NotBlank(message = "Le nom complet est obligatoire.")
    private String fullName;

    @NotBlank(message = "L'adresse email est obligatoire.")
    @Email(message = "L'adresse email doit être valide.")
    private String mail;

    @NotBlank(message = "Le mot de passe est obligatoire.")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères.")
    private String password;

    private String phone; // Optional phone field

    private String address; // Optional address field
}
