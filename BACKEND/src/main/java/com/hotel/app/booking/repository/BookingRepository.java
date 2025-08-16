package com.hotel.app.booking.repository;

import com.hotel.app.booking.model.Booking;
import com.hotel.app.room.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for Booking entity.
 * Provides methods for CRUD operations and custom queries related to bookings.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {

    /**
     * Finds all bookings associated with a specific customer ID.
     * @param customerId The ID of the customer.
     * @return A list of Bookings for the given customer.
     */
    List<Booking> findByCustomerId(String customerId);

    /**
     * Finds all bookings for a specific room ID.
     * @param roomId The ID of the room.
     * @return A list of Bookings for the given room.
     */
    List<Booking> findByRoomId(String roomId);

    /**
     * Finds existing bookings that overlap with a given date range for a specific room.
     * This query is crucial for checking room availability.
     *
     * @param roomId The ID of the room to check.
     * @param checkInDate The desired check-in date.
     * @param checkOutDate The desired check-out date.
     * @return A list of overlapping bookings.
     */
    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId " +
            "AND b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate")
    List<Booking> findOverlappingBookings(String roomId, LocalDate checkInDate, LocalDate checkOutDate);
}
