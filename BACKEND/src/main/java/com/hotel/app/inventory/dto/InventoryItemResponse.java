package com.hotel.app.inventory.dto;

import com.hotel.app.inventory.model.InventoryCategory;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO for returning Inventory Item information in API responses.
 */
@Data
@Builder
public class InventoryItemResponse {
    private String id;
    private String name;
    private String description;
    private String sku;
    private InventoryCategory category;
    private Integer currentStock;
    private Integer minStockLevel;
    private String unitOfMeasure;
    private Double purchasePrice;
    private LocalDate lastRestockDate;
    private String notes;
}
