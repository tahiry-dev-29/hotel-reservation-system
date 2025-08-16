package com.hotel.app.billing.model;

import com.hotel.app.customer.model.Customer; // Import Customer entity
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne; // For Many-to-One relationship with Customer
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate; // For dates
import java.util.List;

/**
 * Represents an Invoice entity in the hotel billing system.
 * This class maps to the 'invoices' table in the database.
 */
@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    @NotBlank(message = "Le numéro de facture est obligatoire.")
    @Column(name = "invoice_number", nullable = false, unique = true)
    private String invoiceNumber;

    @NotNull(message = "Le client est obligatoire.")
    @ManyToOne // Many invoices to one customer
    @JoinColumn(name = "customer_id", nullable = false) // Foreign key to customer table
    private Customer customer;

    // @ManyToOne // Uncomment and set up when Booking entity is created
    // @JoinColumn(name = "booking_id")
    // private Booking booking; // Optional: Link to a specific booking

    @NotNull(message = "La date d'émission est obligatoire.")
    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @NotNull(message = "La date d'échéance est obligatoire.")
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @NotNull(message = "Le montant total est obligatoire.")
    @Min(value = 0, message = "Le montant total ne peut pas être négatif.")
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @NotNull(message = "Le montant payé est obligatoire.")
    @Min(value = 0, message = "Le montant payé ne peut pas être négatif.")
    @Column(name = "paid_amount", nullable = false)
    private Double paidAmount;

    @NotNull(message = "Le solde dû est obligatoire.")
    @Min(value = 0, message = "Le solde dû ne peut pas être négatif.")
    @Column(name = "balance_due", nullable = false)
    private Double balanceDue;

    @NotNull(message = "Le statut de la facture est obligatoire.")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InvoiceStatus status;

    @ElementCollection // For collections of embeddable types
    @CollectionTable(name = "invoice_items", joinColumns = @JoinColumn(name = "invoice_id"))
    @Column(name = "item") // Not strictly needed, but can define column for the embeddable itself
    private List<InvoiceItem> items; // List of items on the invoice

    @Column(name = "notes", columnDefinition = "TEXT") // Optional notes
    private String notes;
}
