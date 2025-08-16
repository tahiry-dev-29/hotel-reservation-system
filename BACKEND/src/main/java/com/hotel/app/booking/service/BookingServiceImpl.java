package com.hotel.app.booking.service;

import com.hotel.app.booking.dto.BookingRequest;
import com.hotel.app.booking.dto.BookingResponse;
import com.hotel.app.booking.mapper.BookingMapper;
import com.hotel.app.booking.model.Booking;
import com.hotel.app.booking.model.BookingStatus;
import com.hotel.app.booking.repository.BookingRepository;
import com.hotel.app.customer.model.Customer;
import com.hotel.app.customer.repository.CustomerRepository;
import com.hotel.app.room.dto.RoomResponse;
import com.hotel.app.room.mapper.RoomMapper;
import com.hotel.app.room.model.Room;
import com.hotel.app.room.model.RoomStatus;
import com.hotel.app.room.repository.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the BookingService interface.
 * Handles booking CRUD operations, availability checks, and status updates.
 */
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final CustomerRepository customerRepository; // For linking customer
    private final RoomRepository roomRepository;         // For linking room and checking availability
    private final RoomMapper roomMapper;                 // For converting Room entity to RoomResponse DTO

    /**
     * Creates a new booking.
     * Validates room availability and capacity before creating the booking.
     * @param request The BookingRequest DTO.
     * @return BookingResponse DTO of the newly created booking.
     * @throws IllegalStateException if the room is not available or does not meet capacity.
     * @throws EntityNotFoundException if customer or room are not found.
     * @throws IllegalArgumentException if check-out date is not after check-in date.
     */
    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        // 1. Validate dates
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new IllegalArgumentException("La date de départ doit être après la date d'arrivée.");
        }

        // 2. Fetch Customer and Room entities
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new EntityNotFoundException("Client non trouvé avec l'ID: " + request.getCustomerId()));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new EntityNotFoundException("Chambre non trouvée avec l'ID: " + request.getRoomId()));

        // 3. Check room availability and capacity
        if (!isRoomAvailable(room.getId(), request.getCheckInDate(), request.getCheckOutDate(), request.getNumAdults(), request.getNumChildren())) {
            throw new IllegalStateException("La chambre n'est pas disponible pour les dates et/ou la capacité demandées.");
        }

        // 4. Calculate total price (basic calculation: price per night * number of nights)
        long numberOfNights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        Double pricePerNight = room.getBasePrice(); // Or use weekendPrice if applicable
        Double totalPrice = pricePerNight * numberOfNights;
        if (room.getOnSale() != null && room.getOnSale() && room.getSalePrice() != null) {
            totalPrice = room.getSalePrice() * numberOfNights;
        }

        // 5. Create Booking entity
        Booking newBooking = bookingMapper.toBookingEntity(request);
        newBooking.setCustomer(customer);
        newBooking.setRoom(room);
        newBooking.setTotalPrice(totalPrice);
        newBooking.setStatus(BookingStatus.PENDING); // Initial status

        Booking savedBooking = bookingRepository.save(newBooking);

        // Optional: Update room status if it's a direct immediate booking (e.g., if room becomes occupied right after booking)
        // This is complex and depends on your business logic (e.g., a confirmed booking might change room status only on check-in)
        // For simplicity, we keep room status separate for now.

        return bookingMapper.toBookingResponse(savedBooking);
    }

    /**
     * Retrieves a booking by its ID.
     * @param id The ID of the booking.
     * @return BookingResponse DTO of the found booking.
     * @throws EntityNotFoundException if the booking is not found.
     */
    @Override
    public BookingResponse getBookingById(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Réservation non trouvée avec l'ID: " + id));
        return bookingMapper.toBookingResponse(booking);
    }

    /**
     * Retrieves all bookings.
     * @return A list of BookingResponse DTOs.
     */
    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(bookingMapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all bookings for a specific customer.
     * @param customerId The ID of the customer.
     * @return A list of BookingResponse DTOs for the given customer.
     * @throws EntityNotFoundException if the customer is not found.
     */
    @Override
    public List<BookingResponse> getBookingsByCustomerId(String customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new EntityNotFoundException("Client non trouvé avec l'ID: " + customerId);
        }
        return bookingRepository.findByCustomerId(customerId).stream()
                .map(bookingMapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all bookings for a specific room.
     * @param roomId The ID of the room.
     * @return A list of BookingResponse DTOs for the given room.
     * @throws EntityNotFoundException if the room is not found.
     */
    @Override
    public List<BookingResponse> getBookingsByRoomId(String roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new EntityNotFoundException("Chambre non trouvée avec l'ID: " + roomId);
        }
        return bookingRepository.findByRoomId(roomId).stream()
                .map(bookingMapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing booking's information.
     * Note: Changes to check-in/out dates or room might require re-validating availability.
     * For simplicity, this update focuses on numAdults, numChildren, and notes.
     * To change dates or room, a new booking is usually created and the old one cancelled.
     * @param id The ID of the booking to update.
     * @param request The BookingRequest DTO with updated details.
     * @return BookingResponse DTO of the updated booking.
     * @throws EntityNotFoundException if the booking is not found.
     * @throws IllegalStateException if capacity is exceeded.
     */
    @Override
    @Transactional
    public BookingResponse updateBooking(String id, BookingRequest request) {
        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Réservation non trouvée avec l'ID: " + id));

        // For updates, we allow modifying only certain fields if the booking is not checked out/cancelled.
        // If changing dates or room, usually a new booking is made.
        if (existingBooking.getStatus() == BookingStatus.CHECKED_OUT || existingBooking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Impossible de modifier une réservation déjà terminée ou annulée.");
        }

        // Update numAdults and numChildren
        if (request.getNumAdults() != null) {
            existingBooking.setNumAdults(request.getNumAdults());
        }
        if (request.getNumChildren() != null) {
            existingBooking.setNumChildren(request.getNumChildren());
        }
        if (request.getNotes() != null) {
            existingBooking.setNotes(request.getNotes());
        }

        // Re-validate capacity with updated numbers
        Room room = existingBooking.getRoom();
        if (existingBooking.getNumAdults() > room.getCapacity().getAdults() ||
            existingBooking.getNumChildren() > room.getCapacity().getChildren()) {
            throw new IllegalStateException("La capacité de la chambre serait dépassée avec les nombres d'adultes/enfants mis à jour.");
        }

        Booking updatedBooking = bookingRepository.save(existingBooking);
        return bookingMapper.toBookingResponse(updatedBooking);
    }

    /**
     * Updates the status of a booking.
     * @param id The ID of the booking to update.
     * @param newStatus The new status for the booking (e.g., CONFIRMED, CHECKED_IN).
     * @return BookingResponse DTO of the updated booking.
     * @throws EntityNotFoundException if the booking is not found.
     */
    @Override
    @Transactional
    public BookingResponse updateBookingStatus(String id, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Réservation non trouvée avec l'ID: " + id));
        booking.setStatus(newStatus);

        // Optional: Update room status based on booking status
        // e.g., if newStatus is CHECKED_IN, set room.roomStatus to OCCUPIED
        // if newStatus is CHECKED_OUT, set room.roomStatus to CLEANING (or AVAILABLE if no cleaning needed)
        // This logic can be more complex and depends on the exact workflow.
        // For now, we only update booking status.

        Booking updatedBooking = bookingRepository.save(booking);
        return bookingMapper.toBookingResponse(updatedBooking);
    }

    /**
     * Deletes a booking by its ID.
     * @param id The ID of the booking to delete.
     * @throws EntityNotFoundException if the booking is not found.
     */
    @Override
    @Transactional
    public void deleteBooking(String id) {
        if (!bookingRepository.existsById(id)) {
            throw new EntityNotFoundException("Réservation non trouvée avec l'ID: " + id);
        }
        bookingRepository.deleteById(id);
    }

    /**
     * Checks if a specific room is available for a given date range and capacity.
     * This method considers existing bookings and room's maximum capacity.
     * @param roomId The ID of the room to check.
     * @param checkInDate The desired check-in date.
     * @param checkOutDate The desired check-out date.
     * @param numAdults Number of adults.
     * @param numChildren Number of children.
     * @return True if the room is available and meets capacity, false otherwise.
     * @throws EntityNotFoundException if the room is not found.
     */
    @Override
    public boolean isRoomAvailable(String roomId, LocalDate checkInDate, LocalDate checkOutDate, Integer numAdults, Integer numChildren) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Chambre non trouvée avec l'ID: " + roomId));

        // 1. Check if the room itself is generally available (not in maintenance, etc.)
        if (room.getRoomStatus() != RoomStatus.AVAILABLE && room.getRoomStatus() != RoomStatus.CLEANING) { // Consider cleaning as temporarily unavailable for new bookings
            return false;
        }

        // 2. Check capacity
        if (numAdults > room.getCapacity().getAdults() || numChildren > room.getCapacity().getChildren()) {
            return false;
        }

        // 3. Check for overlapping bookings
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(roomId, checkInDate, checkOutDate);
        return overlappingBookings.isEmpty(); // If no overlapping bookings, it's available
    }

    /**
     * Finds all available rooms for a given date range and capacity.
     * Iterates through all rooms and checks their availability.
     * @param checkInDate The desired check-in date.
     * @param checkOutDate The desired check-out date.
     * @param numAdults Minimum number of adults the room must accommodate.
     * @param numChildren Minimum number of children the room must accommodate.
     * @return A list of RoomResponse DTOs that are available and meet the capacity requirements.
     */
    @Override
    public List<RoomResponse> findAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, Integer numAdults, Integer numChildren) {
        return roomRepository.findAll().stream()
                .filter(room -> isRoomAvailable(room.getId(), checkInDate, checkOutDate, numAdults, numChildren))
                .map(roomMapper::toRoomResponse)
                .collect(Collectors.toList());
    }
}
