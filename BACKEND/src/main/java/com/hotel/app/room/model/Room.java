package com.hotel.app.room.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection; // For collections of basic types or embeddables
import jakarta.persistence.Embedded; // For embedding the Capacity class
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Represents a Room entity in the hotel management system.
 * This class maps to the 'rooms' table in the database and includes various characteristics.
 */
@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Generate UUID for the ID
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    @NotBlank(message = "Le numéro de chambre est obligatoire.")
    @Column(name = "room_number", nullable = false, unique = true)
    private String roomNumber;

    @NotBlank(message = "Le titre est obligatoire.")
    @Column(name = "title", nullable = false)
    private String title;

    @NotBlank(message = "La description est obligatoire.")
    @Column(name = "description", columnDefinition = "TEXT", nullable = false) // Use TEXT for longer descriptions
    private String description;

    @NotNull(message = "Le type de chambre est obligatoire.")
    @Enumerated(EnumType.STRING) // Store enum as String
    @Column(name = "room_type", nullable = false)
    private RoomType roomType;

    @Embedded // Embed the Capacity object directly into the room table
    @NotNull(message = "La capacité (adultes/enfants) est obligatoire.")
    private Capacity capacity; // This will map adults and children as columns in the rooms table

    @Min(value = 0, message = "La taille en m2 ne peut pas être négative.")
    @Column(name = "size_sq_meters") // Optional: Room size
    private Integer sizeInSqMeters;

    @Column(name = "floor") // Optional: Floor number
    private Integer floor;

    @NotBlank(message = "La configuration des lits est obligatoire.")
    @Column(name = "bed_configuration", nullable = false)
    private String bedConfiguration;

    @Column(name = "view_type") // Optional: View type
    private String viewType;

    @NotNull(message = "Le prix de base est obligatoire.")
    @Min(value = 0, message = "Le prix de base ne peut pas être négatif.")
    @Column(name = "base_price", nullable = false)
    private Double basePrice;

    @Min(value = 0, message = "Le prix week-end ne peut pas être négatif.")
    @Column(name = "weekend_price") // Optional: Weekend price
    private Double weekendPrice;

    @NotNull(message = "Le statut 'onSale' est obligatoire.")
    @Column(name = "on_sale", nullable = false)
    private Boolean onSale;

    @Min(value = 0, message = "Le prix promotionnel ne peut pas être négatif.")
    @Column(name = "sale_price") // Optional: Sale price
    private Double salePrice;

    @ElementCollection // For collections of basic types (like String)
    @CollectionTable(name = "room_images", joinColumns = @JoinColumn(name = "room_id")) // Separate table for images
    @Column(name = "image_url") // Column name in the room_images table
    private List<String> imageUrls; // Gallery of images

    @Column(name = "thumbnail_url") // Primary image for lists
    private String thumbnailUrl;

    @ElementCollection // For collections of enums
    @CollectionTable(name = "room_amenities", joinColumns = @JoinColumn(name = "room_id")) // Separate table for amenities
    @Enumerated(EnumType.STRING) // Store enum as String in the collection table
    @Column(name = "amenity_name") // Column name in the room_amenities table
    private List<Amenity> amenities; // List of available amenities

    @NotNull(message = "Le statut de la chambre est obligatoire.")
    @Enumerated(EnumType.STRING) // Store enum as String
    @Column(name = "room_status", nullable = false)
    private RoomStatus roomStatus;

    @NotNull(message = "Le statut 'isPublished' est obligatoire.")
    @Column(name = "is_published", nullable = false)
    private Boolean isPublished;

    @Column(name = "internal_notes", columnDefinition = "TEXT") // Optional: Notes for staff
    private String internalNotes;
}
