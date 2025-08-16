package com.hotel.app.customer.mapper;

import com.hotel.app.customer.dto.CustomerRegistrationRequest;
import com.hotel.app.customer.dto.CustomerResponse;
import com.hotel.app.customer.model.Customer;
import com.hotel.app.user.dto.UserResponse; // Import UserResponse DTO
import com.hotel.app.user.model.User; // Import User.ROLE enum
import org.springframework.stereotype.Component;

/**
 * Mapper component to convert between Customer entity and Customer/User DTOs.
 */
@Component
public class CustomerMapper {

    /**
     * Converts a Customer entity to a CustomerResponse DTO.
     * @param customer The Customer entity to convert.
     * @return The corresponding CustomerResponse DTO.
     */
    public CustomerResponse toCustomerResponse(Customer customer) {
        if (customer == null) {
            return null;
        }
        return CustomerResponse.builder()
                .id(customer.getId())
                .fullName(customer.getFullName())
                .mail(customer.getMail())
                .phone(customer.getPhone())
                .address(customer.getAddress())
                .build();
    }

    /**
     * Converts a CustomerRegistrationRequest DTO to a Customer entity.
     * @param request The CustomerRegistrationRequest DTO to convert.
     * @return The corresponding Customer entity.
     */
    public Customer toCustomerEntity(CustomerRegistrationRequest request) {
        if (request == null) {
            return null;
        }
        Customer customer = new Customer();
        customer.setFullName(request.getFullName());
        customer.setMail(request.getMail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        // Password and Role will be set by the service
        return customer;
    }

    /**
     * Converts a Customer entity to a UserResponse DTO.
     * This is used when a Customer authenticates, and the AuthResponse
     * expects a UserResponse object for the authenticated principal.
     * @param customer The Customer entity to convert.
     * @return The corresponding UserResponse DTO.
     */
    public UserResponse toUserResponse(Customer customer) {
        if (customer == null) {
            return null;
        }
        return UserResponse.builder()
                .id(customer.getId())
                .fullName(customer.getFullName())
                .mail(customer.getMail())
                .imageUrl(null) // Customers don't have imageUrl in this setup, set to null or handle differently
                .online(true) // Assuming customer is online after login
                .phone(customer.getPhone())
                .role(customer.getRole()) // Set the CUSTOMER role
                .build();
    }
}
