package com.hotel.app.billing.mapper;

import com.hotel.app.billing.dto.PaymentRequest;
import com.hotel.app.billing.dto.PaymentResponse;
import com.hotel.app.billing.model.Payment;
import com.hotel.app.billing.model.Invoice; // Import Invoice entity
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Mapper component to convert between Payment entity and Payment DTOs.
 */
@Component
public class PaymentMapper {

    /**
     * Converts a Payment entity to a PaymentResponse DTO.
     */
    public PaymentResponse toPaymentResponse(Payment payment) {
        if (payment == null) {
            return null;
        }
        return PaymentResponse.builder()
                .id(payment.getId())
                .invoiceId(payment.getInvoice() != null ? payment.getInvoice().getId() : null)
                .paymentDate(payment.getPaymentDate())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .notes(payment.getNotes())
                .build();
    }

    /**
     * Converts a PaymentRequest DTO to a Payment entity.
     * Note: The service layer will fetch the actual Invoice entity using invoiceId.
     */
    public Payment toPaymentEntity(PaymentRequest request, Invoice invoice) { // Pass Invoice entity
        if (request == null) {
            return null;
        }
        Payment payment = new Payment();
        payment.setInvoice(invoice); // Set the full Invoice entity
        payment.setPaymentDate(LocalDateTime.now()); // Set current time for payment date
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionId(request.getTransactionId());
        payment.setNotes(request.getNotes());
        return payment;
    }
}
