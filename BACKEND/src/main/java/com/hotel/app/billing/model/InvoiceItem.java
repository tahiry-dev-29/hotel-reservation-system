package com.hotel.app.billing.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents an item within an invoice.
 * This class is designed to be embedded as a collection within the Invoice entity.
 */
@Embeddable // Marks this class as embeddable within another entity
@Data // Lombok for getters, setters, toString, equals, hashCode
@NoArgsConstructor // Lombok for no-arg constructor
@AllArgsConstructor // Lombok for all-args constructor
public class InvoiceItem {

    @NotBlank(message = "La description de l'article est obligatoire.")
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull(message = "La quantité est obligatoire.")
    @Min(value = 1, message = "La quantité doit être au moins 1.")
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @NotNull(message = "Le prix unitaire est obligatoire.")
    @Min(value = 0, message = "Le prix unitaire ne peut pas être négatif.")
    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;

    @NotNull(message = "Le montant de l'article est obligatoire.")
    @Min(value = 0, message = "Le montant ne peut pas être négatif.")
    @Column(name = "amount", nullable = false)
    private Double amount; // Calculated as quantity * unitPrice (can be set by service)
}
