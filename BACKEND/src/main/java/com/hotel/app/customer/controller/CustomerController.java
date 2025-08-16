package com.hotel.app.customer.controller;

import com.hotel.app.customer.dto.CustomerRegistrationRequest;
import com.hotel.app.customer.dto.CustomerResponse;
import com.hotel.app.customer.dto.CustomerUpdateRequest;
import com.hotel.app.customer.model.Customer; // Import Customer model for authentication check
import com.hotel.app.customer.service.CustomerService;
import com.hotel.app.user.model.User; // Import User.ROLE for role check
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication; // Import Authentication
import org.springframework.security.core.context.SecurityContextHolder; // Import SecurityContextHolder
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing Customer CRUD operations.
 */
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    /**
     * Creates a new customer.
     * Only accessible by ADMIN or EDITOR.
     * (Customers register themselves via /api/customer-auth/register)
     * @param request The CustomerRegistrationRequest DTO.
     * @return A ResponseEntity containing the created CustomerResponse DTO and HTTP status CREATED.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can create customers
    public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CustomerRegistrationRequest request) {
        CustomerResponse createdCustomer = customerService.createCustomer(request);
        return new ResponseEntity<>(createdCustomer, HttpStatus.CREATED);
    }

    /**
     * Get a customer by ID.
     * Accessible by ADMIN, EDITOR (any customer) or the CUSTOMER himself (his own profile).
     * @param id The ID of the customer to retrieve.
     * @return A ResponseEntity containing the CustomerResponse DTO.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR') or (#id == authentication.principal.id and hasRole('CUSTOMER'))")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable String id) {
        // We get the actual principal from the security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalId = null;
        if (authentication != null && authentication.getPrincipal() instanceof Customer) {
            currentPrincipalId = ((Customer) authentication.getPrincipal()).getId();
        } else if (authentication != null && authentication.getPrincipal() instanceof User) {
             currentPrincipalId = ((User) authentication.getPrincipal()).getId();
        }


        // If the user is a customer and trying to access their own profile,
        // or if it's an ADMIN/EDITOR trying to access any profile, allow it.
        // The @PreAuthorize handles the logic, this part just ensures correct data retrieval.
        CustomerResponse customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    /**
     * Get all customers.
     * Only accessible by ADMIN or EDITOR.
     * @return A ResponseEntity containing a list of CustomerResponse DTOs.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can view all customers
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        List<CustomerResponse> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    /**
     * Update a customer's information.
     * Accessible by ADMIN, EDITOR (any customer) or the CUSTOMER himself (his own profile).
     * @param id The ID of the customer to update.
     * @param request The CustomerUpdateRequest DTO.
     * @return A ResponseEntity containing the updated CustomerResponse DTO.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR') or (#id == authentication.principal.id and hasRole('CUSTOMER'))")
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
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can delete customers
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content for successful deletion
    public void deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
    }

    /**
     * Retrieves customers based on segmentation criteria.
     * Accessible by ADMIN or EDITOR.
     * @param hasPhone Optional: filter by customers with/without a phone number.
     * @param emailDomain Optional: filter by email domain (e.g., "gmail.com").
     * @return A ResponseEntity containing a list of CustomerResponse DTOs.
     */
    @GetMapping("/segmentation") // New endpoint for segmentation
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can access segmentation
    public ResponseEntity<List<CustomerResponse>> getSegmentedCustomers(
            @RequestParam(required = false) Boolean hasPhone,
            @RequestParam(required = false) String emailDomain) {
        
        List<CustomerResponse> segmentedCustomers = customerService.getCustomersBySegment(hasPhone, emailDomain);
        return ResponseEntity.ok(segmentedCustomers);
    }
}
