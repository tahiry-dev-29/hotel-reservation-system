package com.hotel.app.customer.service;

import com.hotel.app.customer.dto.CustomerRegistrationRequest;
import com.hotel.app.customer.dto.CustomerResponse;
import com.hotel.app.customer.dto.CustomerUpdateRequest;

import java.util.List;

/**
 * Service interface for managing Customer-related operations.
 * Defines the contract for customer CRUD operations and segmentation.
 */
public interface CustomerService {

    CustomerResponse createCustomer(CustomerRegistrationRequest request);
    CustomerResponse getCustomerById(String id);
    List<CustomerResponse> getAllCustomers();
    CustomerResponse updateCustomer(String id, CustomerUpdateRequest request);
    void deleteCustomer(String id);

    /**
     * Retrieves customers based on specific segmentation criteria.
     * This method can be extended to support various segmentation types (e.g., by email domain,
     * by recent bookings, by loyalty status).
     *
     * @param hasPhone If true, returns customers with a phone number. If false, returns customers without.
     * If null, this criterion is ignored.
     * @param emailDomain Optional: filter by email domain (e.g., "example.com").
     * @return A list of CustomerResponse DTOs matching the criteria.
     */
    List<CustomerResponse> getCustomersBySegment(Boolean hasPhone, String emailDomain);
}
