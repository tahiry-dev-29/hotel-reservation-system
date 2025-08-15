package com.hotel.app.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

/**
 * DTO for customer registration requests.
 * Contains customer details needed to create a new customer entry.
 */
@Data
@Builder
public class CustomerRegistrationRequest {

    @NotNull(message = "Le nom complet est obligatoire.")
    private String fullName;

    @NotNull(message = "L'adresse email est obligatoire.")
    @Email(message = "L'adresse email doit être valide.")
    private String mail;

    private String phone; // Optional phone field

    private String address; // Optional address field
}
