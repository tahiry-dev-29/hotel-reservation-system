package com.hotel.app.inventory.model;

/**
 * Represents categories for inventory items (e.g., Linens, Toiletries, Minibar, Cleaning Supplies).
 */
public enum InventoryCategory {
    LINENS,             // E.g., towels, bedsheets
    TOILETRIES,         // E.g., soap, shampoo, lotion
    MINIBAR,            // E.g., drinks, snacks
    CLEANING_SUPPLIES,  // E.g., detergents, disinfectants
    OFFICE_SUPPLIES,    // E.g., pens, paper
    MAINTENANCE_PARTS,  // E.g., light bulbs, spare parts
    FOOD_AND_BEVERAGE,  // For restaurant/bar consumables not directly minibar
    OTHER               // Catch-all for miscellaneous items
}
