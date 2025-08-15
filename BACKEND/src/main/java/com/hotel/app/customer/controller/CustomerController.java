package com.hotel.app.customer.controller;

import com.hotel.app.customer.dto.CustomerRegistrationRequest;
import com.hotel.app.customer.dto.CustomerResponse;
import com.hotel.app.customer.dto.CustomerUpdateRequest;
import com.hotel.app.customer.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing Customer CRUD operations and segmentation.
 */
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    /**
     * Creates a new customer.
     * Only accessible by ADMIN or EDITOR.
     * @param request The CustomerRegistrationRequest DTO.
     * @return A ResponseEntity containing the created CustomerResponse DTO and HTTP status CREATED.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CustomerRegistrationRequest request) {
        CustomerResponse createdCustomer = customerService.createCustomer(request);
        return new ResponseEntity<>(createdCustomer, HttpStatus.CREATED);
    }

    /**
     * Get a customer by ID.
     * Only accessible by ADMIN or EDITOR.
     * @param id The ID of the customer to retrieve.
     * @return A ResponseEntity containing the CustomerResponse DTO.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable String id) {
        CustomerResponse customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    /**
     * Get all customers.
     * Only accessible by ADMIN or EDITOR.
     * @return A ResponseEntity containing a list of CustomerResponse DTOs.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        List<CustomerResponse> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    /**
     * Update a customer's information.
     * Only accessible by ADMIN or EDITOR.
     * @param id The ID of the customer to update.
     * @param request The CustomerUpdateRequest DTO.
     * @return A ResponseEntity containing the updated CustomerResponse DTO.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<CustomerResponse> updateCustomer(@PathVariable String id,
                                                          @Valid @RequestBody CustomerUpdateRequest request) {
        CustomerResponse updatedCustomer = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(updatedCustomer);
    }

    /**
     * Delete a customer.
     * Only accessible by ADMIN.
     * @param id The ID of the customer to delete.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
    }

    /**
     * Retrieves customers based on segmentation criteria.
     * Accessible by ADMIN or EDITOR.
     * Example segmentation: by phone presence, or by email domain.
     * @param hasPhone Optional: filter by customers with/without a phone number.
     * @param emailDomain Optional: filter by email domain (e.g., "gmail.com").
     * @return A ResponseEntity containing a list of CustomerResponse DTOs.
     */
    @GetMapping("/segmentation") // New endpoint for segmentation
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can access segmentation
    public ResponseEntity<List<CustomerResponse>> getSegmentedCustomers(
            @RequestParam(required = false) Boolean hasPhone, // Optional parameter
            @RequestParam(required = false) String emailDomain) { // Optional parameter
        
        List<CustomerResponse> segmentedCustomers = customerService.getCustomersBySegment(hasPhone, emailDomain);
        return ResponseEntity.ok(segmentedCustomers);
    }
}
