package com.hotel.app.booking.model;

import com.hotel.app.customer.model.Customer; // Import Customer entity
import com.hotel.app.room.model.Room;       // Import Room entity
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Represents a Booking entity in the hotel reservation system.
 * This class maps to the 'bookings' table in the database.
 */
@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // UUID for primary key
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    @NotNull(message = "Le client est obligatoire.")
    @ManyToOne // Many bookings to one customer
    @JoinColumn(name = "customer_id", nullable = false) // Foreign key to customer table
    private Customer customer;

    @NotNull(message = "La chambre est obligatoire.")
    @ManyToOne // Many bookings to one room
    @JoinColumn(name = "room_id", nullable = false) // Foreign key to room table
    private Room room;

    @NotNull(message = "La date d'arrivée est obligatoire.")
    @FutureOrPresent(message = "La date d'arrivée ne peut pas être dans le passé.")
    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @NotNull(message = "La date de départ est obligatoire.")
    @FutureOrPresent(message = "La date de départ ne peut pas être dans le passé.")
    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    @NotNull(message = "Le nombre d'adultes est obligatoire.")
    @Min(value = 1, message = "Le nombre d'adultes doit être au moins 1.")
    @Column(name = "num_adults", nullable = false)
    private Integer numAdults;

    @Min(value = 0, message = "Le nombre d'enfants ne peut pas être négatif.")
    @Column(name = "num_children") // Optional
    private Integer numChildren;

    @NotNull(message = "Le montant total est obligatoire.")
    @Min(value = 0, message = "Le montant total ne peut pas être négatif.")
    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @NotNull(message = "Le statut de la réservation est obligatoire.")
    @Enumerated(EnumType.STRING) // Store enum as String
    @Column(name = "status", nullable = false)
    private BookingStatus status;

    @Column(name = "notes", columnDefinition = "TEXT") // Optional notes for the booking
    private String notes;
}
