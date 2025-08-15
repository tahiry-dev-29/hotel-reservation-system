package com.hotel.app.shared.constants;

// This class holds application-wide constants.
// final: The class cannot be extended.
// private constructor: The class cannot be instantiated.
public final class ApplicationConstants {

    private ApplicationConstants() {
        // Private constructor to prevent instantiation.
    }

    // --- User Roles ---
    // Used in security configurations and role-based access control.
    public static final String ROLE_ADMIN = "ROLE_ADMIN"; // Matches User.ROLE.ADMIN.name()
    public static final String ROLE_EDITOR = "ROLE_EDITOR"; // Matches User.ROLE.EDITOR.name()
    public static final String ROLE_VIEWER = "ROLE_VIEWER"; // Matches User.ROLE.VIEWER.name()

    // --- Booking Statuses ---
    // Represents the lifecycle of a booking.
    public static final String BOOKING_STATUS_PENDING = "PENDING";
    public static final String BOOKING_STATUS_CONFIRMED = "CONFIRMED";
    public static final String BOOKING_STATUS_CHECKED_IN = "CHECKED_IN";
    public static final String BOOKING_STATUS_CHECKED_OUT = "CHECKED_OUT";
    public static final String BOOKING_STATUS_CANCELLED = "CANCELLED";

    // --- Room Statuses ---
    // Represents the state of a hotel room.
    public static final String ROOM_STATUS_AVAILABLE = "AVAILABLE";
    public static final String ROOM_STATUS_OCCUPIED = "OCCUPIED";
    public static final String ROOM_STATUS_MAINTENANCE = "MAINTENANCE";

    // --- Storage ---
    // Path for storing uploaded files.
    public static final String UPLOADS_DIRECTORY = "uploads";

    // --- API Configuration ---
    // Default pagination settings for API responses.
    public static final int DEFAULT_PAGE_NUMBER = 0;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final String DEFAULT_SORT_BY = "id";
    public static final String DEFAULT_SORT_DIRECTION = "asc";
}
