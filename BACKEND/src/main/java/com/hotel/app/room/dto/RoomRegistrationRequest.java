package com.hotel.app.room.dto;

import com.hotel.app.room.model.Amenity;
import com.hotel.app.room.model.Capacity;
import com.hotel.app.room.model.RoomStatus;
import com.hotel.app.room.model.RoomType;
import jakarta.validation.Valid; // For validating nested objects
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * DTO for creating a new room.
 * This DTO does not include image files directly, as they will be handled separately.
 */
@Data
@Builder
public class RoomRegistrationRequest {

    @NotBlank(message = "Le numéro de chambre est obligatoire.")
    private String roomNumber;

    @NotBlank(message = "Le titre est obligatoire.")
    private String title;

    @NotBlank(message = "La description est obligatoire.")
    private String description;

    @NotNull(message = "Le type de chambre est obligatoire.")
    private RoomType roomType;

    @Valid // Validate nested Capacity object
    @NotNull(message = "La capacité (adultes/enfants) est obligatoire.")
    private Capacity capacity;

    @Min(value = 0, message = "La taille en m2 ne peut pas être négative.")
    private Integer sizeInSqMeters;

    private Integer floor;

    @NotBlank(message = "La configuration des lits est obligatoire.")
    private String bedConfiguration;

    private String viewType;

    @NotNull(message = "Le prix de base est obligatoire.")
    @Min(value = 0, message = "Le prix de base ne peut pas être négatif.")
    private Double basePrice;

    @Min(value = 0, message = "Le prix week-end ne peut pas être négatif.")
    private Double weekendPrice;

    @NotNull(message = "Le statut 'onSale' est obligatoire.")
    private Boolean onSale;

    @Min(value = 0, message = "Le prix promotionnel ne peut pas être négatif.")
    private Double salePrice;

    // Image URLs will be handled by the service after upload
    // The client will not send imageUrls directly in the registration request body

    @NotNull(message = "Les équipements sont obligatoires.")
    private List<Amenity> amenities;

    @NotNull(message = "Le statut de la chambre est obligatoire.")
    private RoomStatus roomStatus;

    @NotNull(message = "Le statut 'isPublished' est obligatoire.")
    private Boolean isPublished;

    private String internalNotes;
}
