package com.hotel.app.customer.mapper;

import com.hotel.app.customer.dto.CustomerRegistrationRequest;
import com.hotel.app.customer.dto.CustomerResponse;
import com.hotel.app.customer.model.Customer;
import org.springframework.stereotype.Component;

/**
 * Mapper component to convert between Customer entity and CustomerResponse DTO.
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
        return customer;
    }
}
