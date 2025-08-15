package com.hotel.app.user.mapper;

import com.hotel.app.user.dto.UserInfo;
import com.hotel.app.user.model.User;
import org.springframework.stereotype.Component;

/**
 * Mapper component to convert between User entity and UserInfo DTO.
 */
@Component
public class UserMapper {

    /**
     * Converts a User entity to a UserInfo DTO.
     * @param user The User entity to convert.
     * @return The corresponding UserInfo DTO.
     */
    public UserInfo toUserInfo(User user) {
        if (user == null) {
            return null;
        }
        return UserInfo.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .mail(user.getMail())
                .imageUrl(user.getImageUrl())
                .online(user.isOnline())
                .role(user.getRole())
                .build();
    }
}
