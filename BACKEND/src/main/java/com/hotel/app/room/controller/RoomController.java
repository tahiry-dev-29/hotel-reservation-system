package com.hotel.app.room.controller;

import com.hotel.app.room.dto.RoomRegistrationRequest;
import com.hotel.app.room.dto.RoomResponse;
import com.hotel.app.room.dto.RoomUpdateRequest;
import com.hotel.app.room.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST Controller for managing Room CRUD operations and image handling.
 */
@RestController
@RequestMapping("/api/rooms") // Base path for room management operations
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    /**
     * Creates a new room with its details and associated images.
     * Accessible by ADMIN.
     * @param request The RoomRegistrationRequest DTO (JSON part).
     * @param imageFiles A list of MultipartFile objects for the room images. Optional.
     * @return A ResponseEntity containing the created RoomResponse DTO and HTTP status CREATED.
     */
    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can create rooms
    public ResponseEntity<RoomResponse> createRoom(
            @RequestPart("room") @Valid RoomRegistrationRequest request, // JSON part
            @RequestPart(value = "imageFiles", required = false) List<MultipartFile> imageFiles) {
        
        RoomResponse createdRoom = roomService.createRoom(request, imageFiles);
        return new ResponseEntity<>(createdRoom, HttpStatus.CREATED);
    }

    /**
     * Retrieves a room by its ID.
     * NOW PUBLICLY ACCESSIBLE (removed @PreAuthorize here, relying on SecurityConfig public path).
     * @param id The ID of the room.
     * @return RoomResponse DTO of the found room.
     */
    @GetMapping("/{id}")
    // @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')") // REMOVED FOR PUBLIC ACCESS
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable String id) {
        RoomResponse room = roomService.getRoomById(id);
        return ResponseEntity.ok(room);
    }

    /**
     * Retrieves all rooms.
     * NOW PUBLICLY ACCESSIBLE (removed @PreAuthorize here, relying on SecurityConfig public path).
     * @return A list of RoomResponse DTOs.
     */
    @GetMapping
    // @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')") // REMOVED FOR PUBLIC ACCESS
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        List<RoomResponse> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    /**
     * Updates an existing room's information.
     * Existing images are NOT removed by this method. New images are ADDED.
     * Accessible by ADMIN or EDITOR.
     * @param id The ID of the room to update.
     * @param request The RoomUpdateRequest DTO (JSON part).
     * @param newImageFiles Optional list of new image files to add.
     * @return A ResponseEntity containing the updated RoomResponse DTO.
     */
    @PutMapping(value = "/{id}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')") // Only ADMIN or EDITOR can update rooms
    public ResponseEntity<RoomResponse> updateRoom(
            @PathVariable String id,
            @RequestPart("room") @Valid RoomUpdateRequest request,
            @RequestPart(value = "newImageFiles", required = false) List<MultipartFile> newImageFiles) {

        RoomResponse updatedRoom = roomService.updateRoom(id, request, newImageFiles);
        return ResponseEntity.ok(updatedRoom);
    }

    /**
     * Deletes a room by its ID.
     * Only accessible by ADMIN.
     * @param id The ID of the room to delete.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can delete rooms
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRoom(@PathVariable String id) {
        roomService.deleteRoom(id);
    }

    /**
     * Adds new images to an existing room's gallery.
     * Accessible by ADMIN or EDITOR.
     * @param roomId The ID of the room to which images will be added.
     * @param imageFiles A list of MultipartFile objects for the new images.
     * @return A ResponseEntity containing the updated list of image URLs.
     */
    @PostMapping(value = "/{roomId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<List<String>> addRoomImages(
            @PathVariable String roomId,
            @RequestParam("imageFiles") List<MultipartFile> imageFiles) {
        
        List<String> updatedImageUrls = roomService.addRoomImages(roomId, imageFiles);
        return ResponseEntity.ok(updatedImageUrls);
    }

    /**
     * Removes specific images from a room's gallery by their URLs.
     * Accessible by ADMIN or EDITOR.
     * @param roomId The ID of the room from which images will be removed.
     * @param imageUrlsToRemove A list of image URLs to be removed (sent in request body as JSON array).
     * @return A ResponseEntity containing the updated list of image URLs.
     */
    @DeleteMapping("/{roomId}/images")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<List<String>> removeRoomImages(
            @PathVariable String roomId,
            @RequestBody List<String> imageUrlsToRemove) {

        List<String> updatedImageUrls = roomService.removeRoomImages(roomId, imageUrlsToRemove);
        return ResponseEntity.ok(updatedImageUrls);
    }

    /**
     * Sets a specific image as the thumbnail for a room.
     * Accessible by ADMIN or EDITOR.
     * @param roomId The ID of the room.
     * @param thumbnailUrl The URL of the image to set as thumbnail.
     * @return The updated RoomResponse DTO.
     */
    @PutMapping("/{roomId}/thumbnail")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<RoomResponse> setRoomThumbnail(
            @PathVariable String roomId,
            @RequestBody String thumbnailUrl) {
        
        RoomResponse updatedRoom = roomService.setRoomThumbnail(roomId, thumbnailUrl);
        return ResponseEntity.ok(updatedRoom);
    }
}
