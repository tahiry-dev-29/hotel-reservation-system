package com.hotel.app.billing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

/**
 * DTO representing an item within an invoice for requests and responses.
 */
@Data
@Builder
public class InvoiceItemDto {

    @NotBlank(message = "La description de l'article est obligatoire.")
    private String description;

    @NotNull(message = "La quantité est obligatoire.")
    @Min(value = 1, message = "La quantité doit être au moins 1.")
    private Integer quantity;

    @NotNull(message = "Le prix unitaire est obligatoire.")
    @Min(value = 0, message = "Le prix unitaire ne peut pas être négatif.")
    private Double unitPrice;

    // Amount can be calculated by the service, but can also be provided in request for flexibility
    private Double amount;
}
