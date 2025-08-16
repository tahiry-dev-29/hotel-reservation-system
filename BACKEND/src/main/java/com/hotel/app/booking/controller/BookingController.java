package com.hotel.app.booking.controller;

import com.hotel.app.booking.dto.BookingRequest;
import com.hotel.app.booking.dto.BookingResponse;
import com.hotel.app.booking.model.BookingStatus;
import com.hotel.app.booking.service.BookingService;
import com.hotel.app.customer.model.Customer; // Import Customer entity for auth
import com.hotel.app.room.dto.RoomResponse; // For available rooms response
import com.hotel.app.user.model.User; // Import User for auth
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication; // Import Authentication
import org.springframework.security.core.context.SecurityContextHolder; // Import SecurityContextHolder
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

/**
 * REST Controller for managing Booking operations.
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    /**
     * Helper method to get the current authenticated user's ID.
     * @return The ID of the authenticated user (staff or customer), or null if not authenticated.
     */
    private String getCurrentAuthenticatedPrincipalId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Customer) {
            return ((Customer) authentication.getPrincipal()).getId();
        } else if (authentication != null && authentication.getPrincipal() instanceof User) {
             return ((User) authentication.getPrincipal()).getId();
        }
        return null; // Should not happen if authenticated() is enforced at path level
    }

    /**
     * Creates a new booking.
     * Accessible by ADMIN, EDITOR (for any customer) or CUSTOMER (for themselves only).
     * @param request The BookingRequest DTO.
     * @return A ResponseEntity containing the created BookingResponse DTO and HTTP status CREATED.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR') or " +
                  "(hasRole('CUSTOMER') and #request.customerId == authentication.principal.id)")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        BookingResponse createdBooking = bookingService.createBooking(request);
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }

    /**
     * Retrieves a booking by its ID.
     * Accessible by ADMIN, EDITOR (any booking) or CUSTOMER (their own booking).
     * @param id The ID of the booking.
     * @return A ResponseEntity containing the BookingResponse DTO.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR') or " +
            "(hasRole('CUSTOMER') and @bookingService.getBookingById(#id).customer.id == authentication.principal.id)")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable String id) {
        BookingResponse booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    /**
     * Retrieves all bookings.
     * Accessible by ADMIN or EDITOR.
     * @return A ResponseEntity containing a list of BookingResponse DTOs.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can view all bookings
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    /**
     * Retrieves all bookings for a specific customer.
     * Accessible by ADMIN, EDITOR (any customer's bookings) or CUSTOMER (their own bookings).
     * @param customerId The ID of the customer.
     * @return A ResponseEntity containing a list of BookingResponse DTOs for the given customer.
     */
    @GetMapping("/by-customer/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR') or (#customerId == authentication.principal.id and hasRole('CUSTOMER'))")
    public ResponseEntity<List<BookingResponse>> getBookingsByCustomerId(@PathVariable String customerId) {
        List<BookingResponse> bookings = bookingService.getBookingsByCustomerId(customerId);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Retrieves all bookings for a specific room.
     * Accessible by ADMIN or EDITOR.
     * @param roomId The ID of the room.
     * @return A ResponseEntity containing a list of BookingResponse DTOs for the given room.
     */
    @GetMapping("/by-room/{roomId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can view bookings by room
    public ResponseEntity<List<BookingResponse>> getBookingsByRoomId(@PathVariable String roomId) {
        List<BookingResponse> bookings = bookingService.getBookingsByRoomId(roomId);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Finds all available rooms for a given date range and capacity.
     * Accessible to any authenticated user (staff or customer) and also public.
     * @param checkInDate The desired check-in date (format YYYY-MM-DD).
     * @param checkOutDate The desired check-out date (format YYYY-MM-DD).
     * @param numAdults Minimum number of adults the room must accommodate.
     * @param numChildren Optional: minimum number of children.
     * @return A list of RoomResponse DTOs that are available.
     */
    @GetMapping("/available-rooms")
    @PreAuthorize("permitAll()") // Made public, or authenticated() if preferred for advanced filtering.
    public ResponseEntity<List<RoomResponse>> findAvailableRooms(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
            @RequestParam Integer numAdults,
            @RequestParam(required = false, defaultValue = "0") Integer numChildren) { // Default to 0 if not provided
        
        List<RoomResponse> availableRooms = bookingService.findAvailableRooms(checkInDate, checkOutDate, numAdults, numChildren);
        return ResponseEntity.ok(availableRooms);
    }

    /**
     * Updates an existing booking's information.
     * Accessible by ADMIN, EDITOR (any booking) or CUSTOMER (their own booking, restricted fields).
     * @param id The ID of the booking to update.
     * @param request The BookingRequest DTO with updated details.
     * @return A ResponseEntity containing the updated BookingResponse DTO.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR') or " +
                  "(hasRole('CUSTOMER') and @bookingService.getBookingById(#id).customer.id == authentication.principal.id)")
    public ResponseEntity<BookingResponse> updateBooking(@PathVariable String id,
                                                        @Valid @RequestBody BookingRequest request) {
        // For customer updates, the service layer should enforce what fields can be changed.
        // E.g., a customer cannot change roomId or checkInDate, only numAdults/Children or notes.
        BookingResponse updatedBooking = bookingService.updateBooking(id, request);
        return ResponseEntity.ok(updatedBooking);
    }

    /**
     * Updates the status of a booking.
     * Accessible by ADMIN or EDITOR.
     * @param id The ID of the booking to update.
     * @param newStatus The new status for the booking (as a string, e.g., "CONFIRMED").
     * @return A ResponseEntity containing the updated BookingResponse DTO.
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can change booking status
    public ResponseEntity<BookingResponse> updateBookingStatus(@PathVariable String id,
                                                               @RequestBody BookingStatus newStatus) {
        BookingResponse updatedBooking = bookingService.updateBookingStatus(id, newStatus);
        return ResponseEntity.ok(updatedBooking);
    }

    /**
     * Deletes a booking by its ID.
     * Only accessible by ADMIN.
     * @param id The ID of the booking to delete.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can delete bookings
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
    }
}
