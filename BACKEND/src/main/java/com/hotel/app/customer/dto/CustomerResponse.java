package com.hotel.app.customer.dto;

import lombok.Builder;
import lombok.Data;

/**
 * DTO representing customer information for display or response purposes.
 */
@Data
@Builder
public class CustomerResponse {
    private String id;
    private String fullName;
    private String mail;
    private String phone;
    private String address;
}
