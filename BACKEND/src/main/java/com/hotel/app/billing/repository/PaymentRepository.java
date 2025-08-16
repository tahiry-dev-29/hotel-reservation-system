package com.hotel.app.billing.repository;

import com.hotel.app.billing.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Payment entity.
 * Provides methods for CRUD operations and custom queries.
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {

    /**
     * Finds all payments associated with a specific invoice ID.
     * @param invoiceId The ID of the invoice.
     * @return A list of Payments for the given invoice.
     */
    List<Payment> findByInvoiceId(String invoiceId);
}
