package com.hotel.app.user.controller;

import com.hotel.app.user.dto.UserResponse;
import com.hotel.app.user.dto.UserUpdateRequest;
import com.hotel.app.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // For security
import org.springframework.security.core.Authentication; // Import Authentication for security context
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // For file upload

import java.util.List;
import com.hotel.app.user.model.User; // Import the User model

/**
 * REST Controller for managing User CRUD operations.
 */
@RestController
@RequestMapping("/api/users") // Base path for user management operations
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get a user by ID.
     * Accessible by ADMIN, EDITOR, or the user themselves.
     * @param id The ID of the user to retrieve.
     * @param authentication The Spring Security Authentication object, providing current user details.
     * @return A ResponseEntity containing the UserResponse DTO.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR') or #id == authentication.principal.id")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id, Authentication authentication) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Get all users.
     * Only accessible by ADMIN and EDITOR.
     * @return A ResponseEntity containing a list of UserResponse DTOs.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Update a user's information.
     * Accessible by ADMIN or the user themselves.
     * Note: Role update should be restricted to ADMIN.
     * @param id The ID of the user to update.
     * @param request The UserUpdateRequest DTO containing the updated user details.
     * @param authentication The Spring Security Authentication object, providing current user details.
     * @return A ResponseEntity containing the updated UserResponse DTO.
     * @throws IllegalArgumentException if a non-ADMIN user tries to update their role.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UserResponse> updateUser(@PathVariable String id,
                                                  @Valid @RequestBody UserUpdateRequest request,
                                                  Authentication authentication) {
        // Retrieve the current user's authorities (roles) from the authentication object.
        boolean isAdmin = authentication.getAuthorities().stream()
                                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        // Get the authenticated user's ID
        // Cast authentication.getPrincipal() to User (which implements UserDetails)
        User currentUser = (User) authentication.getPrincipal();
        String currentUserId = currentUser.getId(); // Get the ID from your User object

        // If the request contains a role and the authenticated user is NOT an ADMIN and the target ID
        // is the current user's ID (i.e., they are trying to change their own role),
        // then throw an exception. This prevents non-admins from escalating privileges.
        if (request.getRole() != null && !isAdmin && id.equals(currentUserId)) { // Corrected line
            throw new IllegalArgumentException("Seuls les administrateurs peuvent modifier les rôles.");
        }
        // NOTE: If an ADMIN user updates another user's role, the @PreAuthorize("hasRole('ADMIN')")
        // covers this. The above check specifically targets self-role modification by non-admins.

        UserResponse updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }


    /**
     * Delete a user.
     * Only accessible by ADMIN.
     * @param id The ID of the user to delete.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content for successful deletion
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }

    /**
     * Upload an image for a user.
     * Accessible by ADMIN or the user themselves.
     * @param userId The ID of the user for whom to upload the image.
     * @param file The MultipartFile representing the uploaded image.
     * @param authentication The Spring Security Authentication object, providing current user details.
     * @return A ResponseEntity containing the URL/filename of the stored image.
     */
    @PostMapping("/{userId}/image/upload")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<String> uploadUserImage(@PathVariable String userId,
                                                 @RequestParam("file") MultipartFile file,
                                                 Authentication authentication) {
        String imageUrl = userService.uploadUserImage(userId, file);
        return ResponseEntity.ok(imageUrl);
    }
}
