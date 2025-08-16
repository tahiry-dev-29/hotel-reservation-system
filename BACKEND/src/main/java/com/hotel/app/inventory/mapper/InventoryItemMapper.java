package com.hotel.app.inventory.mapper;

import com.hotel.app.inventory.dto.InventoryItemRegistrationRequest;
import com.hotel.app.inventory.dto.InventoryItemResponse;
import com.hotel.app.inventory.model.InventoryItem;
import org.springframework.stereotype.Component;

/**
 * Mapper component to convert between InventoryItem entity and its DTOs.
 */
@Component
public class InventoryItemMapper {

    /**
     * Converts an InventoryItem entity to an InventoryItemResponse DTO.
     * @param item The InventoryItem entity to convert.
     * @return The corresponding InventoryItemResponse DTO.
     */
    public InventoryItemResponse toInventoryItemResponse(InventoryItem item) {
        if (item == null) {
            return null;
        }
        return InventoryItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .sku(item.getSku())
                .category(item.getCategory())
                .currentStock(item.getCurrentStock())
                .minStockLevel(item.getMinStockLevel())
                .unitOfMeasure(item.getUnitOfMeasure())
                .purchasePrice(item.getPurchasePrice())
                .lastRestockDate(item.getLastRestockDate())
                .notes(item.getNotes())
                .build();
    }

    /**
     * Converts an InventoryItemRegistrationRequest DTO to an InventoryItem entity.
     * @param request The InventoryItemRegistrationRequest DTO to convert.
     * @return The corresponding InventoryItem entity.
     */
    public InventoryItem toInventoryItemEntity(InventoryItemRegistrationRequest request) {
        if (request == null) {
            return null;
        }
        InventoryItem item = new InventoryItem();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setSku(request.getSku());
        item.setCategory(request.getCategory());
        item.setCurrentStock(request.getCurrentStock());
        item.setMinStockLevel(request.getMinStockLevel());
        item.setUnitOfMeasure(request.getUnitOfMeasure());
        item.setPurchasePrice(request.getPurchasePrice());
        item.setLastRestockDate(request.getLastRestockDate());
        item.setNotes(request.getNotes());
        return item;
    }
}
