package com.hotel.app.billing.controller;

import com.hotel.app.billing.dto.InvoiceRequest;
import com.hotel.app.billing.dto.InvoiceResponse;
import com.hotel.app.billing.mapper.InvoiceMapper; // Import InvoiceMapper
import com.hotel.app.billing.model.Invoice; // Import Invoice entity
import com.hotel.app.billing.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing Invoice CRUD operations.
 */
@RestController
@RequestMapping("/api/invoices") // Base path for invoice management operations
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final InvoiceMapper invoiceMapper; // Inject InvoiceMapper

    /**
     * Creates a new invoice.
     * Accessible by ADMIN or EDITOR.
     * @param request The InvoiceRequest DTO.
     * @return A ResponseEntity containing the created InvoiceResponse DTO and HTTP status CREATED.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can create invoices
    public ResponseEntity<InvoiceResponse> createInvoice(@Valid @RequestBody InvoiceRequest request) {
        InvoiceResponse createdInvoice = invoiceService.createInvoice(request);
        return new ResponseEntity<>(createdInvoice, HttpStatus.CREATED);
    }

    /**
     * Retrieves an invoice by its ID.
     * Accessible by ADMIN or EDITOR.
     * @param id The ID of the invoice to retrieve.
     * @return A ResponseEntity containing the InvoiceResponse DTO.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can view any invoice
    public ResponseEntity<InvoiceResponse> getInvoiceById(@PathVariable String id) {
        // Fetch the Invoice ENTITY from the service
        Invoice invoice = invoiceService.getInvoiceById(id);
        // Convert the Invoice ENTITY to an InvoiceResponse DTO using the mapper
        InvoiceResponse invoiceResponse = invoiceMapper.toInvoiceResponse(invoice);
        return ResponseEntity.ok(invoiceResponse);
    }

    /**
     * Retrieves all invoices.
     * Accessible by ADMIN or EDITOR.
     * @return A ResponseEntity containing a list of InvoiceResponse DTOs.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can view all invoices
    public ResponseEntity<List<InvoiceResponse>> getAllInvoices() {
        List<InvoiceResponse> invoices = invoiceService.getAllInvoices();
        return ResponseEntity.ok(invoices);
    }

    /**
     * Retrieves all invoices for a specific customer.
     * Accessible by ADMIN or EDITOR.
     * @param customerId The ID of the customer.
     * @return A ResponseEntity containing a list of InvoiceResponse DTOs for the given customer.
     */
    @GetMapping("/by-customer/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can view invoices by customer
    public ResponseEntity<List<InvoiceResponse>> getInvoicesByCustomerId(@PathVariable String customerId) {
        List<InvoiceResponse> invoices = invoiceService.getInvoicesByCustomerId(customerId);
        return ResponseEntity.ok(invoices);
    }

    /**
     * Updates an existing invoice's information.
     * Accessible by ADMIN or EDITOR.
     * @param id The ID of the invoice to update.
     * @param request The InvoiceRequest DTO with updated details.
     * @return A ResponseEntity containing the updated InvoiceResponse DTO.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can update invoices
    public ResponseEntity<InvoiceResponse> updateInvoice(@PathVariable String id,
                                                        @Valid @RequestBody InvoiceRequest request) {
        InvoiceResponse updatedInvoice = invoiceService.updateInvoice(id, request);
        return ResponseEntity.ok(updatedInvoice);
    }

    /**
     * Updates the status of an invoice.
     * Accessible by ADMIN or EDITOR.
     * @param invoiceId The ID of the invoice to update.
     * @param newStatus The new status for the invoice (as a string, e.g., "PAID", "CANCELLED").
     * @return The updated InvoiceResponse DTO.
     */
    @PatchMapping("/{invoiceId}/status") // Use PATCH for partial updates like status
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<InvoiceResponse> updateInvoiceStatus(@PathVariable String invoiceId,
                                                               @RequestBody String newStatus) {
        InvoiceResponse updatedInvoice = invoiceService.updateInvoiceStatus(invoiceId, newStatus);
        return ResponseEntity.ok(updatedInvoice);
    }

    /**
     * Deletes an invoice by its ID.
     * Only accessible by ADMIN.
     * @param id The ID of the invoice to delete.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can delete invoices
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content for successful deletion
    public void deleteInvoice(@PathVariable String id) {
        invoiceService.deleteInvoice(id);
    }
}
