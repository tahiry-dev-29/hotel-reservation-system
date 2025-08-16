package com.hotel.app.inventory.repository;

import com.hotel.app.inventory.model.InventoryCategory;
import com.hotel.app.inventory.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Import Query annotation
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for InventoryItem entity.
 * Provides methods for CRUD operations and custom queries.
 */
@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, String> {

    /**
     * Finds an InventoryItem by its unique SKU (Stock Keeping Unit).
     * @param sku The unique SKU of the item.
     * @return An Optional containing the InventoryItem if found, or empty otherwise.
     */
    Optional<InventoryItem> findBySku(String sku);

    /**
     * Checks if an inventory item with the given SKU already exists.
     * @param sku The SKU to check.
     * @return True if an item with this SKU exists, false otherwise.
     */
    boolean existsBySku(String sku);

    /**
     * Finds all inventory items belonging to a specific category.
     * @param category The category to filter by.
     * @return A list of InventoryItems in the given category.
     */
    List<InventoryItem> findByCategory(InventoryCategory category);

    /**
     * Finds all inventory items where the current stock is below the minimum stock level.
     * This uses a JPQL query to compare two properties of the same entity.
     * @return A list of InventoryItems that are low in stock.
     */
    @Query("SELECT i FROM InventoryItem i WHERE i.currentStock < i.minStockLevel")
    List<InventoryItem> findLowStockItems(); // Renamed for clarity as it no longer takes implicit parameter
}
