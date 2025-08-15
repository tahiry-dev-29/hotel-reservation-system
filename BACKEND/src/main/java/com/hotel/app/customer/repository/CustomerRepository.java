package com.hotel.app.customer.repository;

import com.hotel.app.customer.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Customer entity.
 * Provides methods for CRUD operations and custom queries.
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {

    /**
     * Finds a Customer by their email address.
     * @param mail The email address of the customer.
     * @return An Optional containing the Customer if found, or empty otherwise.
     */
    Optional<Customer> findByMail(String mail);

    /**
     * Checks if a customer with the given email address already exists.
     * @param mail The email address to check.
     * @return True if a customer with this email exists, false otherwise.
     */
    boolean existsByMail(String mail);
}
