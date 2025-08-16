package com.hotel.app.inventory.dto;

import com.hotel.app.inventory.model.InventoryCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO for creating a new Inventory Item.
 */
@Data
@Builder
public class InventoryItemRegistrationRequest {

    @NotBlank(message = "Le nom de l'article est obligatoire.")
    private String name;

    private String description;

    @NotBlank(message = "Le SKU est obligatoire.")
    private String sku;

    @NotNull(message = "La catégorie est obligatoire.")
    private InventoryCategory category;

    @NotNull(message = "Le stock actuel est obligatoire.")
    @Min(value = 0, message = "Le stock actuel ne peut pas être négatif.")
    private Integer currentStock;

    @NotNull(message = "Le niveau de stock minimum est obligatoire.")
    @Min(value = 0, message = "Le niveau de stock minimum ne peut pas être négatif.")
    private Integer minStockLevel;

    @NotBlank(message = "L'unité de mesure est obligatoire.")
    private String unitOfMeasure;

    @Min(value = 0, message = "Le prix d'achat ne peut pas être négatif.")
    private Double purchasePrice;

    private LocalDate lastRestockDate;

    private String notes;
}
