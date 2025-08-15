package com.hotel.app.room.model;

import jakarta.persistence.Embeddable; // Important for embeddable classes
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents the capacity of a room, detailing the maximum number of adults and children.
 * This class is designed to be embedded within other entities (e.g., Room).
 */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Capacity {

    @NotNull(message = "Le nombre d'adultes est obligatoire.")
    @Min(value = 0, message = "Le nombre d'adultes ne peut pas être négatif.")
    private Integer adults;

    @NotNull(message = "Le nombre d'enfants est obligatoire.")
    @Min(value = 0, message = "Le nombre d'enfants ne peut pas être négatif.")
    private Integer children;
}
