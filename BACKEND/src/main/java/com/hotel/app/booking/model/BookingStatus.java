package com.hotel.app.booking.model;

/**
 * Represents the status of a booking in the reservation system.
 */
public enum BookingStatus {
    PENDING,        // Booking request received, awaiting confirmation
    CONFIRMED,      // Booking is confirmed and active
    CHECKED_IN,     // Guest has checked into the room
    CHECKED_OUT,    // Guest has checked out of the room
    CANCELLED,      // Booking has been cancelled
    NO_SHOW         // Guest did not arrive for the booking
}
