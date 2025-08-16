package com.hotel.app.billing.service;

import com.hotel.app.billing.dto.InvoiceItemDto;
import com.hotel.app.billing.dto.InvoiceRequest;
import com.hotel.app.billing.dto.InvoiceResponse;
import com.hotel.app.billing.mapper.InvoiceMapper;
import com.hotel.app.billing.model.Invoice;
import com.hotel.app.billing.model.InvoiceItem;
import com.hotel.app.billing.model.InvoiceStatus;
import com.hotel.app.billing.repository.InvoiceRepository;
import com.hotel.app.customer.model.Customer;
import com.hotel.app.customer.repository.CustomerRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of the InvoiceService interface.
 * Handles invoice CRUD operations and calculations.
 */
@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;
    private final CustomerRepository customerRepository;

    /**
     * Calculates the total amount for a list of invoice items.
     * @param items The list of InvoiceItemDto.
     * @return The calculated total amount.
     */
    private Double calculateTotalAmount(List<InvoiceItemDto> items) {
        return items.stream()
                .mapToDouble(item -> (item.getQuantity() != null ? item.getQuantity() : 0) *
                                     (item.getUnitPrice() != null ? item.getUnitPrice() : 0.0))
                .sum();
    }

    /**
     * Generates a unique invoice number.
     * For a real application, you might want a more structured numbering system (e.g., prefix + sequence).
     * @return A unique invoice number string.
     */
    private String generateUniqueInvoiceNumber() {
        // Simple UUID-based number. In production, consider sequential numbers with prefix.
        return "INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    @Override
    @Transactional
    public InvoiceResponse createInvoice(InvoiceRequest request) {
        // Find the customer
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new EntityNotFoundException("Client non trouvé avec l'ID: " + request.getCustomerId()));

        // Calculate total amount from items if not provided
        Double totalAmount = request.getTotalAmount();
        if (totalAmount == null) {
            totalAmount = calculateTotalAmount(request.getItems());
        }

        // Initialize paidAmount and balanceDue
        Double paidAmount = request.getPaidAmount() != null ? request.getPaidAmount() : 0.0;
        Double balanceDue = totalAmount - paidAmount;
        
        // Determine initial status
        InvoiceStatus status = request.getStatus();
        if (status == null) {
            if (balanceDue <= 0) {
                status = InvoiceStatus.PAID;
            } else {
                status = InvoiceStatus.PENDING;
            }
        }

        Invoice newInvoice = invoiceMapper.toInvoiceEntity(request, customer);
        newInvoice.setInvoiceNumber(request.getInvoiceNumber() != null ? request.getInvoiceNumber() : generateUniqueInvoiceNumber());
        newInvoice.setTotalAmount(totalAmount);
        newInvoice.setPaidAmount(paidAmount);
        newInvoice.setBalanceDue(balanceDue);
        newInvoice.setStatus(status);

        // Ensure invoice items have their calculated amount if not explicitly provided
        List<InvoiceItem> items = request.getItems().stream()
                .map(itemDto -> {
                    InvoiceItem item = invoiceMapper.toInvoiceItemEntity(itemDto);
                    if (item.getAmount() == null) {
                        item.setAmount(item.getQuantity() * item.getUnitPrice());
                    }
                    return item;
                })
                .collect(Collectors.toList());
        newInvoice.setItems(items);


        Invoice savedInvoice = invoiceRepository.save(newInvoice);
        return invoiceMapper.toInvoiceResponse(savedInvoice);
    }

    @Override
    public Invoice getInvoiceById(String id) { // Changed return type to Invoice
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Facture non trouvée avec l'ID: " + id));
    }

    @Override
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(invoiceMapper::toInvoiceResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InvoiceResponse updateInvoice(String id, InvoiceRequest request) {
        Invoice existingInvoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Facture non trouvée avec l'ID: " + id));

        // Update basic fields if provided
        if (request.getInvoiceNumber() != null && !request.getInvoiceNumber().equals(existingInvoice.getInvoiceNumber())) {
            if (invoiceRepository.existsByInvoiceNumber(request.getInvoiceNumber())) {
                throw new IllegalStateException("Le numéro de facture est déjà utilisé.");
            }
            existingInvoice.setInvoiceNumber(request.getInvoiceNumber());
        }
        if (request.getCustomerId() != null && !request.getCustomerId().equals(existingInvoice.getCustomer().getId())) {
            Customer newCustomer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new EntityNotFoundException("Nouveau client non trouvé avec l'ID: " + request.getCustomerId()));
            existingInvoice.setCustomer(newCustomer);
        }
        if (request.getIssueDate() != null) {
            existingInvoice.setIssueDate(request.getIssueDate());
        }
        if (request.getDueDate() != null) {
            existingInvoice.setDueDate(request.getDueDate());
        }
        if (request.getNotes() != null) {
            existingInvoice.setNotes(request.getNotes());
        }

        // Handle items update: This is a complex operation.
        // For simplicity, this example replaces all items if a new list is provided.
        // For real-world use, you might need more granular add/remove item logic.
        if (request.getItems() != null) {
            List<InvoiceItem> updatedItems = request.getItems().stream()
                    .map(invoiceMapper::toInvoiceItemEntity)
                    .collect(Collectors.toList());
            existingInvoice.setItems(updatedItems);
        }

        // Recalculate totalAmount based on updated items if items were modified or totalAmount not explicitly set
        if (request.getItems() != null || request.getTotalAmount() == null) {
            existingInvoice.setTotalAmount(calculateTotalAmount(
                existingInvoice.getItems().stream()
                    .map(invoiceMapper::toInvoiceItemDto)
                    .collect(Collectors.toList())
            ));
        } else if (request.getTotalAmount() != null) {
            existingInvoice.setTotalAmount(request.getTotalAmount());
        }


        // Update paidAmount and balanceDue if explicitly provided or recalculate if items/total changed
        Double newPaidAmount = request.getPaidAmount() != null ? request.getPaidAmount() : existingInvoice.getPaidAmount();
        existingInvoice.setPaidAmount(newPaidAmount);
        existingInvoice.setBalanceDue(existingInvoice.getTotalAmount() - existingInvoice.getPaidAmount());
        
        // Update status based on balanceDue or if explicitly provided
        if (request.getStatus() != null) {
            existingInvoice.setStatus(request.getStatus());
        } else {
            if (existingInvoice.getBalanceDue() <= 0) {
                existingInvoice.setStatus(InvoiceStatus.PAID);
            } else if (existingInvoice.getDueDate().isBefore(LocalDate.now())) {
                existingInvoice.setStatus(InvoiceStatus.OVERDUE);
            } else {
                existingInvoice.setStatus(InvoiceStatus.PENDING);
            }
        }
        
        Invoice updatedInvoice = invoiceRepository.save(existingInvoice);
        return invoiceMapper.toInvoiceResponse(updatedInvoice);
    }

    @Override
    @Transactional
    public void deleteInvoice(String id) {
        if (!invoiceRepository.existsById(id)) {
            throw new EntityNotFoundException("Facture non trouvée avec l'ID: " + id);
        }
        invoiceRepository.deleteById(id);
    }

    @Override
    public List<InvoiceResponse> getInvoicesByCustomerId(String customerId) {
        List<Invoice> invoices = invoiceRepository.findByCustomerId(customerId);
        return invoices.stream()
                .map(invoiceMapper::toInvoiceResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InvoiceResponse updateInvoiceStatus(String invoiceId, String newStatus) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new EntityNotFoundException("Facture non trouvée avec l'ID: " + invoiceId));
        
        try {
            InvoiceStatus status = InvoiceStatus.valueOf(newStatus.toUpperCase());
            invoice.setStatus(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Statut de facture invalide: " + newStatus);
        }

        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return invoiceMapper.toInvoiceResponse(updatedInvoice);
    }

    @Override
    @Transactional
    public Invoice updateInvoiceAfterPayment(String invoiceId, Double amountPaid) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new EntityNotFoundException("Facture non trouvée avec l'ID: " + invoiceId));

        double currentPaidAmount = invoice.getPaidAmount();
        double newPaidAmount = currentPaidAmount + amountPaid;
        invoice.setPaidAmount(newPaidAmount);
        invoice.setBalanceDue(invoice.getTotalAmount() - newPaidAmount);

        if (invoice.getBalanceDue() <= 0) {
            invoice.setStatus(InvoiceStatus.PAID);
        } else if (invoice.getDueDate().isBefore(LocalDate.now()) && invoice.getBalanceDue() > 0) { // Only OVERDUE if still owed and past due date
            invoice.setStatus(InvoiceStatus.OVERDUE);
        } else {
            invoice.setStatus(InvoiceStatus.PENDING);
        }
        return invoiceRepository.save(invoice);
    }
}
