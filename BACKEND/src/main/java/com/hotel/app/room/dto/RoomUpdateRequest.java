package com.hotel.app.room.dto;

import com.hotel.app.room.model.Amenity;
import com.hotel.app.room.model.Capacity;
import com.hotel.app.room.model.RoomStatus;
import com.hotel.app.room.model.RoomType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * DTO for updating an existing room.
 * All fields are optional (no @NotNull unless specific validation is needed for non-null updates).
 */
@Data
@Builder
public class RoomUpdateRequest {
    // RoomNumber usually not changed
    private String title;
    private String description;
    private RoomType roomType;

    @Valid // Validate nested Capacity object if present in request
    private Capacity capacity;

    @Min(value = 0, message = "La taille en m2 ne peut pas être négative.")
    private Integer sizeInSqMeters;

    private Integer floor;
    private String bedConfiguration;
    private String viewType;

    @Min(value = 0, message = "Le prix de base ne peut pas être négatif.")
    private Double basePrice;

    @Min(value = 0, message = "Le prix week-end ne peut pas être négatif.")
    private Double weekendPrice;

    private Boolean onSale;
    @Min(value = 0, message = "Le prix promotionnel ne peut pas être négatif.")
    private Double salePrice;

    // Image URLs are updated via separate upload endpoints, not here
    private String thumbnailUrl; // Can be updated here if we just point to an existing image

    private List<Amenity> amenities; // Can be updated to replace existing amenities

    private RoomStatus roomStatus;
    private Boolean isPublished;
    private String internalNotes;
}
