package com.hotel.app.billing.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne; // For Many-to-One relationship with Invoice
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime; // For date and time of payment

/**
 * Represents a Payment entity in the hotel billing system.
 * This class maps to the 'payments' table in the database.
 */
@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    @NotNull(message = "La facture associée est obligatoire.")
    @ManyToOne // Many payments to one invoice
    @JoinColumn(name = "invoice_id", nullable = false) // Foreign key to invoice table
    private Invoice invoice;

    @NotNull(message = "La date et l'heure du paiement sont obligatoires.")
    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate;

    @NotNull(message = "Le montant du paiement est obligatoire.")
    @Min(value = 0, message = "Le montant du paiement ne peut pas être négatif.")
    @Column(name = "amount", nullable = false)
    private Double amount;

    @NotNull(message = "La méthode de paiement est obligatoire.")
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Column(name = "transaction_id") // Optional: ID from payment gateway (Stripe, PayPal, etc.)
    private String transactionId;

    @Column(name = "notes", columnDefinition = "TEXT") // Optional notes
    private String notes;
}
