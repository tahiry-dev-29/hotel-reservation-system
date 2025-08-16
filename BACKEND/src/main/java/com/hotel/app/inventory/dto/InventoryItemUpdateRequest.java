package com.hotel.app.inventory.dto;

import com.hotel.app.inventory.model.InventoryCategory;
import jakarta.validation.constraints.Min;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO for updating an existing Inventory Item.
 * All fields are optional as only specific information might be updated.
 */
@Data
@Builder
public class InventoryItemUpdateRequest {
    private String name;
    private String description;
    // SKU is usually not changed after creation, but can be included if needed.
    private InventoryCategory category;
    
    @Min(value = 0, message = "Le stock actuel ne peut pas être négatif.")
    private Integer currentStock;

    @Min(value = 0, message = "Le niveau de stock minimum ne peut pas être négatif.")
    private Integer minStockLevel;

    private String unitOfMeasure;
    
    @Min(value = 0, message = "Le prix d'achat ne peut pas être négatif.")
    private Double purchasePrice;

    private LocalDate lastRestockDate;

    private String notes;
}
