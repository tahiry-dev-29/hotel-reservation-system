package com.hotel.app.inventory.service;

import com.hotel.app.inventory.dto.InventoryItemRegistrationRequest;
import com.hotel.app.inventory.dto.InventoryItemResponse;
import com.hotel.app.inventory.dto.InventoryItemUpdateRequest;
import com.hotel.app.inventory.model.InventoryCategory;

import java.util.List;

/**
 * Service interface for managing Inventory Item operations.
 * Defines the contract for inventory CRUD operations and stock management.
 */
public interface InventoryService {

    /**
     * Creates a new inventory item.
     * @param request The InventoryItemRegistrationRequest DTO.
     * @return InventoryItemResponse DTO of the newly created item.
     */
    InventoryItemResponse createInventoryItem(InventoryItemRegistrationRequest request);

    /**
     * Retrieves an inventory item by its ID.
     * @param id The ID of the item.
     * @return InventoryItemResponse DTO of the found item.
     */
    InventoryItemResponse getInventoryItemById(String id);

    /**
     * Retrieves all inventory items.
     * @return A list of InventoryItemResponse DTOs.
     */
    List<InventoryItemResponse> getAllInventoryItems();

    /**
     * Retrieves all inventory items by category.
     * @param category The category to filter by.
     * @return A list of InventoryItemResponse DTOs.
     */
    List<InventoryItemResponse> getInventoryItemsByCategory(InventoryCategory category);

    /**
     * Retrieves all inventory items that are currently low in stock (currentStock < minStockLevel).
     * @return A list of InventoryItemResponse DTOs for items needing reorder.
     */
    List<InventoryItemResponse> getLowStockItems();

    /**
     * Updates an existing inventory item's information.
     * @param id The ID of the item to update.
     * @param request The InventoryItemUpdateRequest DTO with updated details.
     * @return InventoryItemResponse DTO of the updated item.
     */
    InventoryItemResponse updateInventoryItem(String id, InventoryItemUpdateRequest request);

    /**
     * Adjusts the stock level of an inventory item (e.g., for restock or usage).
     * This method adds/removes the specified quantity from the current stock.
     * @param id The ID of the item to adjust.
     * @param quantity The amount to add (positive) or remove (negative).
     * @return InventoryItemResponse DTO of the updated item.
     */
    InventoryItemResponse adjustStock(String id, Integer quantity);

    /**
     * Deletes an inventory item by its ID.
     * @param id The ID of the item to delete.
     */
    void deleteInventoryItem(String id);
}
