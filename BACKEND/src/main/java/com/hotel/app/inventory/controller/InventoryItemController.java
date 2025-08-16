package com.hotel.app.inventory.controller;

import com.hotel.app.inventory.dto.InventoryItemRegistrationRequest;
import com.hotel.app.inventory.dto.InventoryItemResponse;
import com.hotel.app.inventory.dto.InventoryItemUpdateRequest;
import com.hotel.app.inventory.model.InventoryCategory;
import com.hotel.app.inventory.service.InventoryService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing Inventory Item CRUD operations and stock adjustments.
 */
@RestController
@RequestMapping("/api/inventory") // Base path for inventory management operations
@RequiredArgsConstructor
public class InventoryItemController {

    private final InventoryService inventoryService;

    /**
     * Creates a new inventory item.
     * Accessible by ADMIN or EDITOR.
     * @param request The InventoryItemRegistrationRequest DTO.
     * @return A ResponseEntity containing the created InventoryItemResponse DTO and HTTP status CREATED.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can create inventory items
    public ResponseEntity<InventoryItemResponse> createInventoryItem(@Valid @RequestBody InventoryItemRegistrationRequest request) {
        InventoryItemResponse createdItem = inventoryService.createInventoryItem(request);
        return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
    }

    /**
     * Retrieves an inventory item by its ID.
     * Accessible by ADMIN or EDITOR.
     * @param id The ID of the item to retrieve.
     * @return A ResponseEntity containing the InventoryItemResponse DTO.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can view any inventory item
    public ResponseEntity<InventoryItemResponse> getInventoryItemById(@PathVariable String id) {
        InventoryItemResponse item = inventoryService.getInventoryItemById(id);
        return ResponseEntity.ok(item);
    }

    /**
     * Retrieves all inventory items.
     * Accessible by ADMIN or EDITOR.
     * @return A ResponseEntity containing a list of InventoryItemResponse DTOs.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can view all inventory items
    public ResponseEntity<List<InventoryItemResponse>> getAllInventoryItems() {
        List<InventoryItemResponse> items = inventoryService.getAllInventoryItems();
        return ResponseEntity.ok(items);
    }

    /**
     * Retrieves inventory items by category.
     * Accessible by ADMIN or EDITOR.
     * @param category The category to filter by (e.g., "LINENS", "MINIBAR").
     * @return A ResponseEntity containing a list of InventoryItemResponse DTOs.
     */
    @GetMapping("/category/{category}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can view items by category
    public ResponseEntity<List<InventoryItemResponse>> getInventoryItemsByCategory(@PathVariable InventoryCategory category) {
        List<InventoryItemResponse> items = inventoryService.getInventoryItemsByCategory(category);
        return ResponseEntity.ok(items);
    }

    /**
     * Retrieves all inventory items that are currently low in stock.
     * Accessible by ADMIN or EDITOR.
     * @return A ResponseEntity containing a list of InventoryItemResponse DTOs for items needing reorder.
     */
    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can view low stock items
    public ResponseEntity<List<InventoryItemResponse>> getLowStockItems() {
        List<InventoryItemResponse> items = inventoryService.getLowStockItems();
        return ResponseEntity.ok(items);
    }

    /**
     * Updates an existing inventory item's information.
     * Accessible by ADMIN or EDITOR.
     * @param id The ID of the item to update.
     * @param request The InventoryItemUpdateRequest DTO with updated details.
     * @return A ResponseEntity containing the updated InventoryItemResponse DTO.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can update inventory items
    public ResponseEntity<InventoryItemResponse> updateInventoryItem(@PathVariable String id,
                                                                    @Valid @RequestBody InventoryItemUpdateRequest request) {
        InventoryItemResponse updatedItem = inventoryService.updateInventoryItem(id, request);
        return ResponseEntity.ok(updatedItem);
    }

    /**
     * Adjusts the stock level of an inventory item.
     * Accessible by ADMIN or EDITOR.
     * @param id The ID of the item to adjust.
     * @param quantity The amount to add (positive) or remove (negative).
     * @return A ResponseEntity containing the updated InventoryItemResponse DTO.
     */
    @PatchMapping("/{id}/adjust-stock") // Use PATCH for partial updates like stock adjustment
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can adjust stock
    public ResponseEntity<InventoryItemResponse> adjustStock(@PathVariable String id,
                                                            @RequestParam @Min(value = -1000000, message = "La quantité d'ajustement doit être un nombre valide.") Integer quantity) { // Min/Max for reasonable quantity
        InventoryItemResponse updatedItem = inventoryService.adjustStock(id, quantity);
        return ResponseEntity.ok(updatedItem);
    }

    /**
     * Deletes an inventory item by its ID.
     * Only accessible by ADMIN.
     * @param id The ID of the item to delete.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can delete inventory items
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content for successful deletion
    public void deleteInventoryItem(@PathVariable String id) {
        inventoryService.deleteInventoryItem(id);
    }
}
