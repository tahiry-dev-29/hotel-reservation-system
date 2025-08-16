package com.hotel.app.billing.controller;

import com.hotel.app.billing.dto.PaymentRequest;
import com.hotel.app.billing.dto.PaymentResponse;
import com.hotel.app.billing.service.PaymentService;
import com.hotel.app.billing.service.InvoiceService; // Import InvoiceService to check ownership
import com.hotel.app.customer.model.Customer; // Import Customer for auth
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
 * REST Controller for managing Payment CRUD operations.
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final InvoiceService invoiceService; // Inject InvoiceService to check invoice ownership

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
        return null;
    }

    /**
     * Creates a new payment for an invoice.
     * Accessible by ADMIN or EDITOR.
     * @param request The PaymentRequest DTO.
     * @return A ResponseEntity containing the created PaymentResponse DTO and HTTP status CREATED.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can record payments
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse createdPayment = paymentService.createPayment(request);
        return new ResponseEntity<>(createdPayment, HttpStatus.CREATED);
    }

    /**
     * Retrieves a payment by its ID.
     * Accessible by ADMIN, EDITOR (any payment) or the CUSTOMER if the payment's invoice belongs to them.
     * @param id The ID of the payment to retrieve.
     * @return A ResponseEntity containing the PaymentResponse DTO.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR') or " +
            "(hasRole('CUSTOMER') and @invoiceService.getInvoiceById(@paymentService.getPaymentById(#id).invoiceId).customer.id == authentication.principal.id)")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable String id) {
        PaymentResponse payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }

    /**
     * Retrieves all payments.
     * Accessible by ADMIN or EDITOR.
     * @return A ResponseEntity containing a list of PaymentResponse DTOs.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can view all payments
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        List<PaymentResponse> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    /**
     * Retrieves all payments for a specific invoice.
     * Accessible by ADMIN, EDITOR (any invoice's payments) or the CUSTOMER if the invoice belongs to them.
     * @param invoiceId The ID of the invoice.
     * @return A ResponseEntity containing a list of PaymentResponse DTOs for the given invoice.
     */
    @GetMapping("/by-invoice/{invoiceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR') or " +
            "(hasRole('CUSTOMER') and @invoiceService.getInvoiceById(#invoiceId).customer.id == authentication.principal.id)")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByInvoiceId(@PathVariable String invoiceId) {
        List<PaymentResponse> payments = paymentService.getPaymentsByInvoiceId(invoiceId);
        return ResponseEntity.ok(payments);
    }

    /**
     * Deletes a payment by its ID.
     * Only accessible by ADMIN.
     * @param id The ID of the payment to delete.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can delete payments
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePayment(@PathVariable String id) {
        paymentService.deletePayment(id);
    }
}
