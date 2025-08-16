package com.hotel.app.billing.dto;

import com.hotel.app.billing.model.PaymentMethod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for creating a new Payment.
 */
@Data
@Builder
public class PaymentRequest {

    @NotBlank(message = "L'ID de la facture est obligatoire.")
    private String invoiceId;

    @NotNull(message = "Le montant du paiement est obligatoire.")
    @Min(value = 0, message = "Le montant du paiement ne peut pas être négatif.")
    private Double amount;

    @NotNull(message = "La méthode de paiement est obligatoire.")
    private PaymentMethod paymentMethod;

    private String transactionId; // Optional transaction ID from payment gateway

    private String notes;
}
