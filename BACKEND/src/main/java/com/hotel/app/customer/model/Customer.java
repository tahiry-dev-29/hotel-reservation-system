package com.hotel.app.customer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a Customer entity in the database.
 * This class maps to the 'customers' table and includes validation constraints.
 */
@Entity
@Table(name = "customers") // Maps this entity to the 'customers' table in the database
@Data // Lombok annotation to generate getters, setters, toString, equals, and hashCode methods
@NoArgsConstructor // Lombok annotation to generate a no-argument constructor
@AllArgsConstructor // Lombok annotation to generate an all-argument constructor
public class Customer {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.UUID) // JPA generates UUID for the ID
    @Column(name = "id", nullable = false, unique = true) // Maps to 'id' column, ensures it's not null and unique
    private String id;

    @NotNull(message = "Le nom complet du client est obligatoire.")
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @NotNull(message = "L'adresse email du client est obligatoire.")
    @Email(message = "L'adresse email doit être valide.")
    @Column(name = "mail", nullable = false, unique = true) // Email should be unique for customers too
    private String mail;

    @Column(name = "phone") // Optional phone number
    private String phone;

    @Column(name = "address") // Optional address
    private String address;

    // You can add more customer-specific fields here, e.g., loyalty points, notes, etc.
}
