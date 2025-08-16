package com.hotel.app.billing.service;

import com.hotel.app.billing.dto.PaymentRequest;
import com.hotel.app.billing.dto.PaymentResponse;
import com.hotel.app.billing.mapper.PaymentMapper;
import com.hotel.app.billing.model.Invoice;
import com.hotel.app.billing.model.Payment;
import com.hotel.app.billing.repository.PaymentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy; // For @Lazy to break circular dependency
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the PaymentService interface.
 * Handles payment CRUD operations and updates associated invoices.
 */
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    // Use @Lazy to break potential circular dependency with InvoiceService
    private final @Lazy InvoiceService invoiceService; 

    /**
     * Records a new payment for an invoice.
     * Updates the associated invoice's paid amount and status.
     * @param request The PaymentRequest DTO.
     * @return PaymentResponse DTO of the newly recorded payment.
     * @throws EntityNotFoundException if the associated invoice is not found.
     */
    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        // Fetch the associated invoice
        Invoice invoice = invoiceService.getInvoiceById(request.getInvoiceId()); // Use invoiceService to fetch Invoice entity

        // Create Payment entity
        Payment newPayment = paymentMapper.toPaymentEntity(request, invoice);
        
        // Save the payment
        Payment savedPayment = paymentRepository.save(newPayment);

        // Update the invoice's paid amount and status
        invoiceService.updateInvoiceAfterPayment(invoice.getId(), savedPayment.getAmount());

        return paymentMapper.toPaymentResponse(savedPayment);
    }

    /**
     * Retrieves a payment by its ID.
     * @param id The ID of the payment.
     * @return PaymentResponse DTO of the found payment.
     * @throws EntityNotFoundException if the payment is not found.
     */
    @Override
    public PaymentResponse getPaymentById(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paiement non trouvé avec l'ID: " + id));
        return paymentMapper.toPaymentResponse(payment);
    }

    /**
     * Retrieves all payments.
     * @return A list of PaymentResponse DTOs.
     */
    @Override
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(paymentMapper::toPaymentResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all payments for a specific invoice.
     * @param invoiceId The ID of the invoice.
     * @return A list of PaymentResponse DTOs for the given invoice.
     * @throws EntityNotFoundException if the invoice is not found.
     */
    @Override
    public List<PaymentResponse> getPaymentsByInvoiceId(String invoiceId) {
        // Ensure invoice exists before fetching payments
        invoiceService.getInvoiceById(invoiceId); // This will throw EntityNotFoundException if invoice doesn't exist
        return paymentRepository.findByInvoiceId(invoiceId).stream()
                .map(paymentMapper::toPaymentResponse)
                .collect(Collectors.toList());
    }

    /**
     * Deletes a payment by its ID.
     * Important: If you allow deleting payments, you might need to
     * implement logic to reverse the payment's impact on the associated invoice's
     * paid amount and status. For simplicity, this is not implemented here.
     * @param id The ID of the payment to delete.
     * @throws EntityNotFoundException if the payment is not found.
     */
    @Override
    @Transactional
    public void deletePayment(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paiement non trouvé avec l'ID: " + id));
        
        // IMPORTANT: If deleting payments, consider recalculating the invoice's paid_amount and status.
        // For example:
        // invoiceService.updateInvoiceAfterPayment(payment.getInvoice().getId(), -payment.getAmount());
        
        paymentRepository.deleteById(id);
    }
}
