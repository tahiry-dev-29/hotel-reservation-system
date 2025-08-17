package com.hotel.app.room.dto;

import com.hotel.app.room.model.Amenity;
import com.hotel.app.room.model.Capacity;
import com.hotel.app.room.model.RoomStatus;
import com.hotel.app.room.model.RoomType;
import com.hotel.app.room.model.ViewType; // Import ViewType enum
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * DTO for returning Room information in API responses.
 */
@Data
@Builder
public class RoomResponse {
    private String id;
    private String roomNumber;
    private String title;
    private String description;
    private RoomType roomType;
    private Capacity capacity;
    private Integer sizeInSqMeters;
    private Integer floor;
    private String bedConfiguration;
    private ViewType viewType; // Changed to ViewType enum
    private Double basePrice;
    private Double weekendPrice;
    private Boolean onSale;
    private Double salePrice;
    private List<String> imageUrls;
    private String thumbnailUrl;
    private List<Amenity> amenities;
    private RoomStatus roomStatus;
    private Boolean isPublished;
    private String internalNotes;
}
