package com.hotel.app.billing.repository;

import com.hotel.app.billing.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Invoice entity.
 * Provides methods for CRUD operations and custom queries.
 */
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {

    /**
     * Finds an Invoice by its unique invoice number.
     * @param invoiceNumber The unique invoice number.
     * @return An Optional containing the Invoice if found, or empty otherwise.
     */
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    /**
     * Checks if an invoice with the given invoice number already exists.
     * @param invoiceNumber The invoice number to check.
     * @return True if an invoice with this number exists, false otherwise.
     */
    boolean existsByInvoiceNumber(String invoiceNumber);

    /**
     * Finds all invoices associated with a specific customer ID.
     * @param customerId The ID of the customer.
     * @return A list of Invoices for the given customer.
     */
    List<Invoice> findByCustomerId(String customerId);
}
