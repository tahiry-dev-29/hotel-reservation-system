package com.hotel.app.billing.mapper;

import com.hotel.app.billing.dto.InvoiceItemDto;
import com.hotel.app.billing.dto.InvoiceRequest;
import com.hotel.app.billing.dto.InvoiceResponse;
import com.hotel.app.billing.model.Invoice;
import com.hotel.app.billing.model.InvoiceItem;
import com.hotel.app.customer.mapper.CustomerMapper; // Import CustomerMapper
import com.hotel.app.customer.model.Customer; // Import Customer model
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper component to convert between Invoice entity and Invoice DTOs.
 */
@Component
public class InvoiceMapper {

    private final CustomerMapper customerMapper; // Inject CustomerMapper

    public InvoiceMapper(CustomerMapper customerMapper) {
        this.customerMapper = customerMapper;
    }

    /**
     * Converts an InvoiceItem entity to an InvoiceItemDto.
     */
    public InvoiceItemDto toInvoiceItemDto(InvoiceItem item) {
        if (item == null) {
            return null;
        }
        return InvoiceItemDto.builder()
                .description(item.getDescription())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .amount(item.getAmount())
                .build();
    }

    /**
     * Converts an InvoiceItemDto to an InvoiceItem entity.
     */
    public InvoiceItem toInvoiceItemEntity(InvoiceItemDto dto) {
        if (dto == null) {
            return null;
        }
        return new InvoiceItem(
                dto.getDescription(),
                dto.getQuantity(),
                dto.getUnitPrice(),
                dto.getAmount() != null ? dto.getAmount() : dto.getQuantity() * dto.getUnitPrice() // Calculate if not provided
        );
    }

    /**
     * Converts an Invoice entity to an InvoiceResponse DTO.
     */
    public InvoiceResponse toInvoiceResponse(Invoice invoice) {
        if (invoice == null) {
            return null;
        }
        List<InvoiceItemDto> itemDtos = invoice.getItems() != null ?
                invoice.getItems().stream()
                        .map(this::toInvoiceItemDto)
                        .collect(Collectors.toList()) :
                List.of(); // Return empty list if no items

        return InvoiceResponse.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .customer(customerMapper.toCustomerResponse(invoice.getCustomer())) // Map Customer to DTO
                .issueDate(invoice.getIssueDate())
                .dueDate(invoice.getDueDate())
                .totalAmount(invoice.getTotalAmount())
                .paidAmount(invoice.getPaidAmount())
                .balanceDue(invoice.getBalanceDue())
                .status(invoice.getStatus())
                .items(itemDtos)
                .notes(invoice.getNotes())
                .build();
    }

    /**
     * Converts an InvoiceRequest DTO to an Invoice entity.
     * Note: This method does not fully hydrate Customer/Booking objects.
     * The service layer will fetch the actual Customer entity using customerId.
     */
    public Invoice toInvoiceEntity(InvoiceRequest request, Customer customer) { // Pass Customer entity
        if (request == null) {
            return null;
        }
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(request.getInvoiceNumber());
        invoice.setCustomer(customer); // Set the full Customer entity
        invoice.setIssueDate(request.getIssueDate());
        invoice.setDueDate(request.getDueDate());
        invoice.setTotalAmount(request.getTotalAmount());
        invoice.setPaidAmount(request.getPaidAmount() != null ? request.getPaidAmount() : 0.0);
        invoice.setBalanceDue(request.getBalanceDue() != null ? request.getBalanceDue() : request.getTotalAmount());
        invoice.setStatus(request.getStatus());
        
        List<InvoiceItem> items = request.getItems() != null ?
                request.getItems().stream()
                        .map(this::toInvoiceItemEntity)
                        .collect(Collectors.toList()) :
                new java.util.ArrayList<>(); // Use new ArrayList instead of List.of() for mutability
        invoice.setItems(items);

        invoice.setNotes(request.getNotes());
        return invoice;
    }
}
