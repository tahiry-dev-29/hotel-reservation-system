package com.hotel.app.user.repository;

import com.hotel.app.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entity.
 * Provides methods for CRUD operations and custom queries.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    /**
     * Finds a User by their email address.
     * Used for authentication purposes.
     * @param mail The email address of the user.
     * @return An Optional containing the User if found, or empty otherwise.
     */
    Optional<User> findByMail(String mail);

    /**
     * Checks if a user with the given email address already exists.
     * @param mail The email address to check.
     * @return True if a user with this email exists, false otherwise.
     */
    boolean existsByMail(String mail);
}
