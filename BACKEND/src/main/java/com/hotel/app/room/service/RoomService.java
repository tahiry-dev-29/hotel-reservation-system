package com.hotel.app.room.service;

import com.hotel.app.room.dto.RoomRegistrationRequest;
import com.hotel.app.room.dto.RoomResponse;
import com.hotel.app.room.dto.RoomUpdateRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Service interface for managing Room-related operations.
 * Defines the contract for room CRUD operations and image handling.
 */
public interface RoomService {

    /**
     * Creates a new room with its details and associated images.
     * @param request The RoomRegistrationRequest DTO.
     * @param imageFiles A list of MultipartFile objects for the room images. Can be empty.
     * @return RoomResponse DTO of the newly created room.
     */
    RoomResponse createRoom(RoomRegistrationRequest request, List<MultipartFile> imageFiles);

    /**
     * Retrieves a room by its ID.
     * @param id The ID of the room.
     * @return RoomResponse DTO of the found room.
     */
    RoomResponse getRoomById(String id);

    /**
     * Retrieves all rooms.
     * @return A list of RoomResponse DTOs.
     */
    List<RoomResponse> getAllRooms();

    /**
     * Updates an existing room's information.
     * @param id The ID of the room to update.
     * @param request The RoomUpdateRequest DTO.
     * @param newImageFiles Optional list of new image files to add to the room's gallery.
     * @return RoomResponse DTO of the updated room.
     */
    RoomResponse updateRoom(String id, RoomUpdateRequest request, List<MultipartFile> newImageFiles);

    /**
     * Deletes a room by its ID.
     * @param id The ID of the room to delete.
     */
    void deleteRoom(String id);

    /**
     * Adds new images to an existing room's gallery.
     * @param roomId The ID of the room to which images will be added.
     * @param imageFiles A list of MultipartFile objects for the new images.
     * @return The updated list of image URLs for the room.
     */
    List<String> addRoomImages(String roomId, List<MultipartFile> imageFiles);

    /**
     * Removes specific images from a room's gallery by their URLs.
     * @param roomId The ID of the room from which images will be removed.
     * @param imageUrlsToRemove A list of image URLs to be removed.
     * @return The updated list of image URLs for the room.
     */
    List<String> removeRoomImages(String roomId, List<String> imageUrlsToRemove);

    /**
     * Sets a specific image as the thumbnail for a room.
     * The image URL must already exist in the room's imageUrls list.
     * @param roomId The ID of the room.
     * @param thumbnailUrl The URL of the image to set as thumbnail.
     * @return The updated RoomResponse DTO.
     */
    RoomResponse setRoomThumbnail(String roomId, String thumbnailUrl);
}
