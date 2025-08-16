package com.hotel.app.booking.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO for creating a new Booking.
 * Customer ID will be extracted from authenticated principal if customer booking for themselves.
 */
@Data
@Builder
public class BookingRequest {

    @NotBlank(message = "L'ID du client est obligatoire.")
    private String customerId; // Client ID making the booking

    @NotBlank(message = "L'ID de la chambre est obligatoire.")
    private String roomId; // Room being booked

    @NotNull(message = "La date d'arrivée est obligatoire.")
    @FutureOrPresent(message = "La date d'arrivée ne peut pas être dans le passé.")
    private LocalDate checkInDate;

    @NotNull(message = "La date de départ est obligatoire.")
    @FutureOrPresent(message = "La date de départ ne peut pas être dans le passé.")
    private LocalDate checkOutDate;

    @NotNull(message = "Le nombre d'adultes est obligatoire.")
    @Min(value = 1, message = "Le nombre d'adultes doit être au moins 1.")
    private Integer numAdults;

    @Min(value = 0, message = "Le nombre d'enfants ne peut pas être négatif.")
    private Integer numChildren;

    private String notes; // Optional notes for the booking
}
