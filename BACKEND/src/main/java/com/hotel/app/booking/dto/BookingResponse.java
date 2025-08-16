package com.hotel.app.booking.dto;

import com.hotel.app.booking.model.BookingStatus;
import com.hotel.app.customer.dto.CustomerResponse; // Import CustomerResponse DTO
import com.hotel.app.room.dto.RoomResponse; // Import RoomResponse DTO
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO for returning Booking information in API responses.
 */
@Data
@Builder
public class BookingResponse {
    private String id;
    private CustomerResponse customer; // Full customer details in response
    private RoomResponse room;       // Full room details in response
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numAdults;
    private Integer numChildren;
    private Double totalPrice;
    private BookingStatus status;
    private String notes;
}
