package com.hotel.app.billing.dto;

import com.hotel.app.billing.model.PaymentMethod;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for returning Payment information in API responses.
 */
@Data
@Builder
public class PaymentResponse {
    private String id;
    private String invoiceId; // Just the ID for simplicity in payment response
    private LocalDateTime paymentDate;
    private Double amount;
    private PaymentMethod paymentMethod;
    private String transactionId;
    private String notes;
}
