package com.hotel.app.booking.mapper;

import com.hotel.app.booking.dto.BookingRequest;
import com.hotel.app.booking.dto.BookingResponse;
import com.hotel.app.booking.model.Booking;
import com.hotel.app.customer.mapper.CustomerMapper; // Import CustomerMapper
import com.hotel.app.room.mapper.RoomMapper;       // Import RoomMapper
import com.hotel.app.customer.model.Customer;      // Import Customer entity
import com.hotel.app.room.model.Room;              // Import Room entity
import org.springframework.stereotype.Component;

/**
 * Mapper component to convert between Booking entity and Booking DTOs.
 */
@Component
public class BookingMapper {

    private final CustomerMapper customerMapper;
    private final RoomMapper roomMapper;

    public BookingMapper(CustomerMapper customerMapper, RoomMapper roomMapper) {
        this.customerMapper = customerMapper;
        this.roomMapper = roomMapper;
    }

    /**
     * Converts a Booking entity to a BookingResponse DTO.
     * @param booking The Booking entity to convert.
     * @return The corresponding BookingResponse DTO.
     */
    public BookingResponse toBookingResponse(Booking booking) {
        if (booking == null) {
            return null;
        }
        return BookingResponse.builder()
                .id(booking.getId())
                .customer(customerMapper.toCustomerResponse(booking.getCustomer()))
                .room(roomMapper.toRoomResponse(booking.getRoom()))
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .numAdults(booking.getNumAdults())
                .numChildren(booking.getNumChildren())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .notes(booking.getNotes())
                .build();
    }

    /**
     * Converts a BookingRequest DTO to a Booking entity.
     * Note: Customer and Room entities are not fully set here; they will be fetched by the service.
     * @param request The BookingRequest DTO to convert.
     * @return The corresponding Booking entity.
     */
    public Booking toBookingEntity(BookingRequest request) {
        if (request == null) {
            return null;
        }
        Booking booking = new Booking();
        // Customer and Room will be set by the service after fetching from repositories
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setNumAdults(request.getNumAdults());
        booking.setNumChildren(request.getNumChildren());
        // Total price will be calculated by the service
        // Status will be set by the service (e.g., PENDING)
        booking.setNotes(request.getNotes());
        return booking;
    }
}
