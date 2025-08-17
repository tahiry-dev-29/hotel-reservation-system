// src/main/java/com/hotel/app/room/model/Amenity.java
package com.hotel.app.room.model;

public enum Amenity {
    WIFI,
    TV, // Added from frontend
    AC, // Added from frontend
    MINIBAR, // Added from frontend
    BALCONY, // Added from frontend
    VIEW, // Added from frontend
    BATHTUB, // Added from frontend
    COFFEEMAKER, // Added from frontend
    POOL,
    KITCHEN,
    PET_FRIENDLY,
    FREE_PARKING,
    AIR_CONDITIONING, // Redundant with AC, but keeping both if needed, consider consolidating
    HEATING,
    PRIVATE_BATHROOM
}
