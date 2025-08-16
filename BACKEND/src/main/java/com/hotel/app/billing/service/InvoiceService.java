package com.hotel.app.billing.service;

import com.hotel.app.billing.dto.InvoiceRequest;
import com.hotel.app.billing.dto.InvoiceResponse;
import com.hotel.app.billing.model.Invoice; // Import Invoice entity

import java.util.List;

/**
 * Service interface for managing Invoice-related operations.
 * Defines the contract for invoice CRUD operations.
 */
public interface InvoiceService {

    /**
     * Creates a new invoice. Calculates total amount, paid amount, and balance due based on items.
     * @param request The InvoiceRequest DTO.
     * @return InvoiceResponse DTO of the newly created invoice.
     */
    InvoiceResponse createInvoice(InvoiceRequest request);

    /**
     * Retrieves an invoice by its ID.
     * IMPORTANT: This method now returns the Invoice ENTITY for internal service use.
     * @param id The ID of the invoice.
     * @return Invoice ENTITY of the found invoice.
     */
    Invoice getInvoiceById(String id); // Changed return type to Invoice

    /**
     * Retrieves all invoices.
     * @return A list of InvoiceResponse DTOs.
     */
    List<InvoiceResponse> getAllInvoices();

    /**
     * Updates an existing invoice's information.
     * Recalculates amounts and updates status if needed based on changes.
     * @param id The ID of the invoice to update.
     * @param request The InvoiceRequest DTO with updated details.
     * @return InvoiceResponse DTO of the updated invoice.
     */
    InvoiceResponse updateInvoice(String id, InvoiceRequest request);

    /**
     * Deletes an invoice by its ID.
     * @param id The ID of the invoice to delete.
     */
    void deleteInvoice(String id);

    /**
     * Retrieves all invoices for a specific customer.
     * @param customerId The ID of the customer.
     * @return A list of InvoiceResponse DTOs for the given customer.
     */
    List<InvoiceResponse> getInvoicesByCustomerId(String customerId);

    /**
     * Updates the status of an invoice. Internal use, e.g., after payments.
     * @param invoiceId The ID of the invoice to update.
     * @param newStatus The new status for the invoice.
     * @return The updated InvoiceResponse DTO.
     */
    InvoiceResponse updateInvoiceStatus(String invoiceId, String newStatus);

    /**
     * Updates the paid amount and status of an invoice after a payment is made.
     * This method is called internally by the PaymentService.
     * @param invoiceId The ID of the invoice to update.
     * @param amountPaid The amount that was just paid.
     * @return The updated Invoice entity.
     */
    Invoice updateInvoiceAfterPayment(String invoiceId, Double amountPaid);
}
