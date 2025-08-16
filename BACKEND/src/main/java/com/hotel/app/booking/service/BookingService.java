package com.hotel.app.booking.service;

import com.hotel.app.booking.dto.BookingRequest;
import com.hotel.app.booking.dto.BookingResponse;
import com.hotel.app.booking.model.BookingStatus;
import com.hotel.app.room.dto.RoomResponse; // For available rooms

import java.time.LocalDate;
import java.util.List;

/**
 * Service interface for managing Booking-related operations.
 * Defines the contract for booking CRUD operations and availability checks.
 */
public interface BookingService {

    /**
     * Creates a new booking.
     * Validates room availability and capacity before creating the booking.
     * @param request The BookingRequest DTO.
     * @return BookingResponse DTO of the newly created booking.
     */
    BookingResponse createBooking(BookingRequest request);

    /**
     * Retrieves a booking by its ID.
     * @param id The ID of the booking.
     * @return BookingResponse DTO of the found booking.
     */
    BookingResponse getBookingById(String id);

    /**
     * Retrieves all bookings.
     * @return A list of BookingResponse DTOs.
     */
    List<BookingResponse> getAllBookings();

    /**
     * Retrieves all bookings for a specific customer.
     * @param customerId The ID of the customer.
     * @return A list of BookingResponse DTOs for the given customer.
     */
    List<BookingResponse> getBookingsByCustomerId(String customerId);

    /**
     * Retrieves all bookings for a specific room.
     * @param roomId The ID of the room.
     * @return A list of BookingResponse DTOs for the given room.
     */
    List<BookingResponse> getBookingsByRoomId(String roomId);

    /**
     * Updates an existing booking's information.
     * Note: Changes to check-in/out dates or room might require re-validating availability.
     * For simplicity, this update focuses on numAdults, numChildren, and notes.
     * @param id The ID of the booking to update.
     * @param request The BookingRequest DTO with updated details.
     * @return BookingResponse DTO of the updated booking.
     */
    BookingResponse updateBooking(String id, BookingRequest request);

    /**
     * Updates the status of a booking.
     * @param id The ID of the booking to update.
     * @param newStatus The new status for the booking (e.g., CONFIRMED, CHECKED_IN).
     * @return BookingResponse DTO of the updated booking.
     */
    BookingResponse updateBookingStatus(String id, BookingStatus newStatus);

    /**
     * Deletes a booking by its ID.
     * @param id The ID of the booking to delete.
     */
    void deleteBooking(String id);

    /**
     * Checks if a specific room is available for a given date range and capacity.
     * @param roomId The ID of the room to check.
     * @param checkInDate The desired check-in date.
     * @param checkOutDate The desired check-out date.
     * @param numAdults Number of adults.
     * @param numChildren Number of children.
     * @return True if the room is available and meets capacity, false otherwise.
     */
    boolean isRoomAvailable(String roomId, LocalDate checkInDate, LocalDate checkOutDate, Integer numAdults, Integer numChildren);

    /**
     * Finds all available rooms for a given date range and capacity.
     * @param checkInDate The desired check-in date.
     * @param checkOutDate The desired check-out date.
     * @param numAdults Minimum number of adults the room must accommodate.
     * @param numChildren Minimum number of children the room must accommodate.
     * @return A list of RoomResponse DTOs that are available and meet the capacity requirements.
     */
    List<RoomResponse> findAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, Integer numAdults, Integer numChildren);
}
