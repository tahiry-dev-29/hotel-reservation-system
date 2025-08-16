package com.hotel.app.billing.controller;

import com.hotel.app.billing.dto.InvoiceRequest;
import com.hotel.app.billing.dto.InvoiceResponse;
import com.hotel.app.billing.mapper.InvoiceMapper;
import com.hotel.app.billing.model.Invoice;
import com.hotel.app.billing.service.InvoiceService;
import com.hotel.app.customer.model.Customer; // Import Customer entity for auth
import com.hotel.app.user.model.User; // Import User for auth
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing Invoice CRUD operations.
 */
@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final InvoiceMapper invoiceMapper;

    /**
     * Helper method to get the current authenticated user's ID.
     * @return The ID of the authenticated user (staff or customer), or null if not authenticated.
     */
    private String getCurrentAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Customer) {
            return ((Customer) authentication.getPrincipal()).getId();
        } else if (authentication != null && authentication.getPrincipal() instanceof User) {
            return ((User) authentication.getPrincipal()).getId();
        }
        return null; // Should not happen with authenticated() in SecurityConfig for this path
    }

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
     * Accessible by ADMIN, EDITOR (any invoice) or the CUSTOMER if the invoice belongs to them.
     * @param id The ID of the invoice to retrieve.
     * @return A ResponseEntity containing the InvoiceResponse DTO.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR') or " +
            "(hasRole('CUSTOMER') and @invoiceService.getInvoiceById(#id).customer.id == authentication.principal.id)")
    public ResponseEntity<InvoiceResponse> getInvoiceById(@PathVariable String id) {
        Invoice invoice = invoiceService.getInvoiceById(id);
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
     * Accessible by ADMIN, EDITOR (any customer's invoices) or the CUSTOMER himself (his own invoices).
     * @param customerId The ID of the customer.
     * @return A ResponseEntity containing a list of InvoiceResponse DTOs for the given customer.
     */
    @GetMapping("/by-customer/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR') or (#customerId == authentication.principal.id and hasRole('CUSTOMER'))")
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
    @PatchMapping("/{invoiceId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can update invoice status
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
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInvoice(@PathVariable String id) {
        invoiceService.deleteInvoice(id);
    }
}
