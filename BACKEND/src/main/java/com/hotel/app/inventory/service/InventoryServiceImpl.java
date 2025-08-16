package com.hotel.app.inventory.service;

import com.hotel.app.inventory.dto.InventoryItemRegistrationRequest;
import com.hotel.app.inventory.dto.InventoryItemResponse;
import com.hotel.app.inventory.dto.InventoryItemUpdateRequest;
import com.hotel.app.inventory.mapper.InventoryItemMapper;
import com.hotel.app.inventory.model.InventoryCategory;
import com.hotel.app.inventory.model.InventoryItem;
import com.hotel.app.inventory.repository.InventoryItemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the InventoryService interface.
 * Handles inventory item CRUD operations and stock adjustments.
 */
@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryItemMapper inventoryItemMapper;

    /**
     * Creates a new inventory item.
     * Checks if an item with the given SKU already exists.
     * @param request The InventoryItemRegistrationRequest DTO.
     * @return InventoryItemResponse DTO of the newly created item.
     * @throws IllegalStateException if an item with the given SKU already exists.
     */
    @Override
    @Transactional
    public InventoryItemResponse createInventoryItem(InventoryItemRegistrationRequest request) {
        if (inventoryItemRepository.existsBySku(request.getSku())) {
            throw new IllegalStateException("Un article avec ce SKU existe déjà.");
        }
        InventoryItem newItem = inventoryItemMapper.toInventoryItemEntity(request);
        // Set lastRestockDate to today if not provided and initial stock is > 0
        if (newItem.getLastRestockDate() == null && newItem.getCurrentStock() > 0) {
            newItem.setLastRestockDate(LocalDate.now());
        }
        InventoryItem savedItem = inventoryItemRepository.save(newItem);
        return inventoryItemMapper.toInventoryItemResponse(savedItem);
    }

    /**
     * Retrieves an inventory item by its ID.
     * @param id The ID of the item.
     * @return InventoryItemResponse DTO of the found item.
     * @throws EntityNotFoundException if the item is not found.
     */
    @Override
    public InventoryItemResponse getInventoryItemById(String id) {
        InventoryItem item = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Article d'inventaire non trouvé avec l'ID: " + id));
        return inventoryItemMapper.toInventoryItemResponse(item);
    }

    /**
     * Retrieves all inventory items.
     * @return A list of InventoryItemResponse DTOs.
     */
    @Override
    public List<InventoryItemResponse> getAllInventoryItems() {
        return inventoryItemRepository.findAll().stream()
                .map(inventoryItemMapper::toInventoryItemResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all inventory items by category.
     * @param category The category to filter by.
     * @return A list of InventoryItemResponse DTOs.
     */
    @Override
    public List<InventoryItemResponse> getInventoryItemsByCategory(InventoryCategory category) {
        return inventoryItemRepository.findByCategory(category).stream()
                .map(inventoryItemMapper::toInventoryItemResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all inventory items that are currently low in stock (currentStock < minStockLevel).
     * @return A list of InventoryItemResponse DTOs for items needing reorder.
     */
    @Override
    public List<InventoryItemResponse> getLowStockItems() {
        return inventoryItemRepository.findLowStockItems().stream() // Changed method call
                .map(inventoryItemMapper::toInventoryItemResponse)
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing inventory item's information.
     * @param id The ID of the item to update.
     * @param request The InventoryItemUpdateRequest DTO with updated details.
     * @return InventoryItemResponse DTO of the updated item.
     * @throws EntityNotFoundException if the item is not found.
     * @throws IllegalStateException if the new SKU conflicts with another existing item.
     */
    @Override
    @Transactional
    public InventoryItemResponse updateInventoryItem(String id, InventoryItemUpdateRequest request) {
        InventoryItem existingItem = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Article d'inventaire non trouvé avec l'ID: " + id));

        if (request.getName() != null) {
            existingItem.setName(request.getName());
        }
        if (request.getDescription() != null) {
            existingItem.setDescription(request.getDescription());
        }
        // SKU update is often restricted, but if allowed:
        // if (request.getSku() != null && !request.getSku().equals(existingItem.getSku())) {
        //     if (inventoryItemRepository.existsBySku(request.getSku())) {
        //         throw new IllegalStateException("Un article avec ce SKU existe déjà.");
        //     }
        //     existingItem.setSku(request.getSku());
        // }
        if (request.getCategory() != null) {
            existingItem.setCategory(request.getCategory());
        }
        if (request.getCurrentStock() != null) {
            existingItem.setCurrentStock(request.getCurrentStock());
        }
        if (request.getMinStockLevel() != null) {
            existingItem.setMinStockLevel(request.getMinStockLevel());
        }
        if (request.getUnitOfMeasure() != null) {
            existingItem.setUnitOfMeasure(request.getUnitOfMeasure());
        }
        if (request.getPurchasePrice() != null) {
            existingItem.setPurchasePrice(request.getPurchasePrice());
        }
        if (request.getLastRestockDate() != null) {
            existingItem.setLastRestockDate(request.getLastRestockDate());
        }
        if (request.getNotes() != null) {
            existingItem.setNotes(request.getNotes());
        }

        InventoryItem updatedItem = inventoryItemRepository.save(existingItem);
        return inventoryItemMapper.toInventoryItemResponse(updatedItem);
    }

    /**
     * Adjusts the stock level of an inventory item.
     * This method adds/removes the specified quantity from the current stock.
     * If the adjustment results in negative stock, an IllegalArgumentException is thrown.
     * Also updates the last restock date if stock is increased.
     * @param id The ID of the item to adjust.
     * @param quantity The amount to add (positive) or remove (negative).
     * @return InventoryItemResponse DTO of the updated item.
     * @throws EntityNotFoundException if the item is not found.
     * @throws IllegalArgumentException if the stock adjustment results in a negative quantity.
     */
    @Override
    @Transactional
    public InventoryItemResponse adjustStock(String id, Integer quantity) {
        if (quantity == null) {
            throw new IllegalArgumentException("La quantité d'ajustement est obligatoire.");
        }

        InventoryItem item = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Article d'inventaire non trouvé avec l'ID: " + id));

        int newStock = item.getCurrentStock() + quantity;
        if (newStock < 0) {
            throw new IllegalArgumentException("Le stock ne peut pas devenir négatif. Tentative de retirer " + (-quantity) + " unités mais seulement " + item.getCurrentStock() + " en stock.");
        }

        item.setCurrentStock(newStock);
        // If stock is increased, update last restock date
        if (quantity > 0) {
            item.setLastRestockDate(LocalDate.now());
        }

        InventoryItem updatedItem = inventoryItemRepository.save(item);
        return inventoryItemMapper.toInventoryItemResponse(updatedItem);
    }

    /**
     * Deletes an inventory item by its ID.
     * @param id The ID of the item to delete.
     * @throws EntityNotFoundException if the item is not found.
     */
    @Override
    @Transactional
    public void deleteInventoryItem(String id) {
        if (!inventoryItemRepository.existsById(id)) {
            throw new EntityNotFoundException("Article d'inventaire non trouvé avec l'ID: " + id);
        }
        inventoryItemRepository.deleteById(id);
    }
}
