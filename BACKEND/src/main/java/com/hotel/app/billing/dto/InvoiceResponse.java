package com.hotel.app.billing.dto;

import com.hotel.app.billing.model.InvoiceStatus;
import com.hotel.app.customer.dto.CustomerResponse; // Use CustomerResponse DTO
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO for returning Invoice information in API responses.
 */
@Data
@Builder
public class InvoiceResponse {
    private String id;
    private String invoiceNumber;
    private CustomerResponse customer; // Return CustomerResponse DTO
    // private BookingResponse booking; // Will be uncommented when booking DTO exists
    private LocalDate issueDate;
    private LocalDate dueDate;
    private Double totalAmount;
    private Double paidAmount;
    private Double balanceDue;
    private InvoiceStatus status;
    private List<InvoiceItemDto> items; // Return InvoiceItemDto
    private String notes;
}
