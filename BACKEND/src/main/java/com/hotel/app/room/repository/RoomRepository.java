package com.hotel.app.room.repository;

import com.hotel.app.room.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Room entity.
 * Provides methods for CRUD operations and custom queries.
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, String> {

    /**
     * Finds a Room by its room number.
     * @param roomNumber The unique room number.
     * @return An Optional containing the Room if found, or empty otherwise.
     */
    Optional<Room> findByRoomNumber(String roomNumber);

    /**
     * Checks if a room with the given room number already exists.
     * @param roomNumber The room number to check.
     * @return True if a room with this number exists, false otherwise.
     */
    boolean existsByRoomNumber(String roomNumber);
}
