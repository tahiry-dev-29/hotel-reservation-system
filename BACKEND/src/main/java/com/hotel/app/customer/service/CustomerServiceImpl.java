package com.hotel.app.customer.service;

import com.hotel.app.customer.dto.CustomerRegistrationRequest;
import com.hotel.app.customer.dto.CustomerResponse;
import com.hotel.app.customer.dto.CustomerUpdateRequest;
import com.hotel.app.customer.mapper.CustomerMapper;
import com.hotel.app.customer.model.Customer;
import com.hotel.app.customer.repository.CustomerRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the CustomerService interface.
 * Handles customer CRUD operations and segmentation.
 */
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    /**
     * Creates a new customer entry.
     * @param request The CustomerRegistrationRequest DTO.
     * @return CustomerResponse DTO of the newly created customer.
     * @throws IllegalStateException if a customer with the given email already exists.
     */
    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerRegistrationRequest request) {
        if (customerRepository.existsByMail(request.getMail())) {
            throw new IllegalStateException("Un client avec cet email existe déjà.");
        }
        Customer newCustomer = customerMapper.toCustomerEntity(request);
        Customer savedCustomer = customerRepository.save(newCustomer);
        return customerMapper.toCustomerResponse(savedCustomer);
    }

    /**
     * Retrieves a customer by their ID.
     * @param id The ID of the customer.
     * @return CustomerResponse DTO of the found customer.
     * @throws EntityNotFoundException if the customer is not found.
     */
    @Override
    public CustomerResponse getCustomerById(String id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client non trouvé avec l'ID: " + id));
        return customerMapper.toCustomerResponse(customer);
    }

    /**
     * Retrieves all customers.
     * @return A list of CustomerResponse DTOs.
     */
    @Override
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toCustomerResponse)
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing customer's information.
     * @param id The ID of the customer to update.
     * @param request The CustomerUpdateRequest DTO.
     * @return CustomerResponse DTO of the updated customer.
     * @throws EntityNotFoundException if the customer is not found.
     * @throws IllegalStateException if the new email conflicts with another existing customer.
     */
    @Override
    @Transactional
    public CustomerResponse updateCustomer(String id, CustomerUpdateRequest request) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client non trouvé avec l'ID: " + id));

        if (request.getFullName() != null) {
            existingCustomer.setFullName(request.getFullName());
        }
        if (request.getMail() != null) {
            if (!request.getMail().equals(existingCustomer.getMail()) && customerRepository.existsByMail(request.getMail())) {
                throw new IllegalStateException("L'adresse email est déjà utilisée par un autre client.");
            }
            existingCustomer.setMail(request.getMail());
        }
        if (request.getPhone() != null) {
            existingCustomer.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            existingCustomer.setAddress(request.getAddress());
        }

        Customer updatedCustomer = customerRepository.save(existingCustomer);
        return customerMapper.toCustomerResponse(updatedCustomer);
    }

    /**
     * Deletes a customer by their ID.
     * @param id The ID of the customer to delete.
     * @throws EntityNotFoundException if the customer is not found.
     */
    @Override
    @Transactional
    public void deleteCustomer(String id) {
        if (!customerRepository.existsById(id)) {
            throw new EntityNotFoundException("Client non trouvé avec l'ID: " + id);
        }
        customerRepository.deleteById(id);
    }

    /**
     * Retrieves customers based on specific segmentation criteria.
     * For demonstration, this example filters by the presence of a phone number and/or email domain.
     * In a real application, you might use more complex queries or specifications.
     *
     * @param hasPhone If true, returns customers with a phone number. If false, returns customers without.
     * If null, this criterion is ignored.
     * @param emailDomain Optional: filter by email domain (e.g., "example.com").
     * @return A list of CustomerResponse DTOs matching the criteria.
     */
    @Override
    public List<CustomerResponse> getCustomersBySegment(Boolean hasPhone, String emailDomain) {
        List<Customer> customers;

        if (hasPhone != null) {
            // Filter by phone presence
            if (hasPhone) {
                // Customers with phone not null and not empty
                customers = customerRepository.findAll().stream()
                        .filter(c -> c.getPhone() != null && !c.getPhone().trim().isEmpty())
                        .collect(Collectors.toList());
            } else {
                // Customers with phone null or empty
                customers = customerRepository.findAll().stream()
                        .filter(c -> c.getPhone() == null || c.getPhone().trim().isEmpty())
                        .collect(Collectors.toList());
            }
        } else {
            // If hasPhone is null, start with all customers
            customers = customerRepository.findAll();
        }

        // Further filter by email domain if provided
        if (emailDomain != null && !emailDomain.trim().isEmpty()) {
            String lowerCaseEmailDomain = emailDomain.trim().toLowerCase();
            customers = customers.stream()
                    .filter(c -> c.getMail() != null && c.getMail().toLowerCase().endsWith("@" + lowerCaseEmailDomain))
                    .collect(Collectors.toList());
        }

        return customers.stream()
                .map(customerMapper::toCustomerResponse)
                .collect(Collectors.toList());
    }
}
