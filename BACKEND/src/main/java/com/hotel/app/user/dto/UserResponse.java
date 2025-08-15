package com.hotel.app.user.dto;

import com.hotel.app.user.model.User;
import lombok.Builder;
import lombok.Data;

/**
 * DTO representing simplified user information for display or response purposes.
 * Does not include sensitive data like password.
 */
@Data
@Builder
public class UserResponse {
    private String id;
    private String fullName;
    private String mail;
    private String imageUrl;
    private boolean online;
    private String phone;
    private User.ROLE role;
}
