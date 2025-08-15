package com.hotel.app.user.mapper;

import com.hotel.app.user.dto.UserResponse; // Changed from UserInfo
import com.hotel.app.user.model.User;
import org.springframework.stereotype.Component;

/**
 * Mapper component to convert between User entity and UserResponse DTO.
 */
@Component
public class UserMapper {

    /**
     * Converts a User entity to a UserResponse DTO.
     * @param user The User entity to convert.
     * @return The corresponding UserResponse DTO.
     */
    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .mail(user.getMail())
                .imageUrl(user.getImageUrl())
                .online(user.isOnline())
                .phone(user.getPhone()) // Map the new phone field
                .role(user.getRole())
                .build();
    }
}
