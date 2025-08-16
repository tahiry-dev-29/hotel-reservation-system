package com.hotel.app.billing.service;

import com.hotel.app.billing.dto.PaymentRequest;
import com.hotel.app.billing.dto.PaymentResponse;

import java.util.List;

/**
 * Service interface for managing Payment-related operations.
 * Defines the contract for payment CRUD operations.
 */
public interface PaymentService {

    /**
     * Records a new payment for an invoice.
     * Updates the associated invoice's paid amount and status.
     * @param request The PaymentRequest DTO.
     * @return PaymentResponse DTO of the newly recorded payment.
     */
    PaymentResponse createPayment(PaymentRequest request);

    /**
     * Retrieves a payment by its ID.
     * @param id The ID of the payment.
     * @return PaymentResponse DTO of the found payment.
     */
    PaymentResponse getPaymentById(String id);

    /**
     * Retrieves all payments.
     * @return A list of PaymentResponse DTOs.
     */
    List<PaymentResponse> getAllPayments();

    /**
     * Retrieves all payments for a specific invoice.
     * @param invoiceId The ID of the invoice.
     * @return A list of PaymentResponse DTOs for the given invoice.
     */
    List<PaymentResponse> getPaymentsByInvoiceId(String invoiceId);

    /**
     * Deletes a payment by its ID.
     * Note: Deleting a payment might require recalculating invoice amounts/status.
     * @param id The ID of the payment to delete.
     */
    void deletePayment(String id);
}
