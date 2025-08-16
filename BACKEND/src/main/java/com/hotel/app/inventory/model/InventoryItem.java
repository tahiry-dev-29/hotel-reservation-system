package com.hotel.app.inventory.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate; // For last restock date

/**
 * Represents an Inventory Item in the hotel's stock management system.
 * This class maps to the 'inventory_items' table in the database.
 */
@Entity
@Table(name = "inventory_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Generate UUID for the ID
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    @NotBlank(message = "Le nom de l'article est obligatoire.")
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT") // Optional detailed description
    private String description;

    @NotBlank(message = "Le SKU est obligatoire.")
    @Column(name = "sku", nullable = false, unique = true) // Stock Keeping Unit - unique identifier for tracking
    private String sku;

    @NotNull(message = "La catégorie est obligatoire.")
    @Enumerated(EnumType.STRING) // Store enum as String
    @Column(name = "category", nullable = false)
    private InventoryCategory category;

    @NotNull(message = "Le stock actuel est obligatoire.")
    @Min(value = 0, message = "Le stock actuel ne peut pas être négatif.")
    @Column(name = "current_stock", nullable = false)
    private Integer currentStock;

    @NotNull(message = "Le niveau de stock minimum est obligatoire.")
    @Min(value = 0, message = "Le niveau de stock minimum ne peut pas être négatif.")
    @Column(name = "min_stock_level", nullable = false)
    private Integer minStockLevel;

    @NotBlank(message = "L'unité de mesure est obligatoire.")
    @Column(name = "unit_of_measure", nullable = false) // E.g., "unité", "paquet", "litre"
    private String unitOfMeasure;

    @Min(value = 0, message = "Le prix d'achat ne peut pas être négatif.")
    @Column(name = "purchase_price") // Optional: Price paid to acquire the item
    private Double purchasePrice;

    @Column(name = "last_restock_date") // Optional: Date of the last replenishment
    private LocalDate lastRestockDate;

    @Column(name = "notes", columnDefinition = "TEXT") // Optional internal notes
    private String notes;

    // TODO: You could later add a ManyToOne relationship to a 'Supplier' entity here.
}
