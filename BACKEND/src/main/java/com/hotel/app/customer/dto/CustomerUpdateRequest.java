package com.hotel.app.customer.dto;

import jakarta.validation.constraints.Email;
import lombok.Builder;
import lombok.Data;

/**
 * DTO for customer update requests.
 * All fields are optional as only specific information might be updated.
 */
@Data
@Builder
public class CustomerUpdateRequest {
    private String fullName;
    
    @Email(message = "L'adresse email doit être valide.")
    private String mail;

    private String phone;
    private String address;
}
