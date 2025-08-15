package com.hotel.app.room.service;

import com.hotel.app.room.dto.RoomRegistrationRequest;
import com.hotel.app.room.dto.RoomResponse;
import com.hotel.app.room.dto.RoomUpdateRequest;
import com.hotel.app.room.mapper.RoomMapper;
import com.hotel.app.room.model.Room;
import com.hotel.app.room.repository.RoomRepository;
import com.hotel.app.storage.service.StorageService; // Import StorageService for image handling
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Implementation of the RoomService interface.
 * Handles room CRUD operations and image management.
 */
@Service
@RequiredArgsConstructor
public class RoomServiceImlp implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;
    private final StorageService storageService; // Inject StorageService

    /**
     * Creates a new room with its details and associated images.
     * @param request The RoomRegistrationRequest DTO.
     * @param imageFiles A list of MultipartFile objects for the room images. Can be empty.
     * @return RoomResponse DTO of the newly created room.
     * @throws IllegalStateException if a room with the given room number already exists.
     */
    @Override
    @Transactional
    public RoomResponse createRoom(RoomRegistrationRequest request, List<MultipartFile> imageFiles) {
        if (roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new IllegalStateException("Une chambre avec ce numéro existe déjà.");
        }

        Room newRoom = roomMapper.toRoomEntity(request);

        // Handle image uploads
        if (imageFiles != null && !imageFiles.isEmpty()) {
            List<String> uploadedImageUrls = storageService.store(imageFiles);
            newRoom.setImageUrls(uploadedImageUrls);
            // Set the first uploaded image as thumbnail by default
            if (!uploadedImageUrls.isEmpty()) {
                newRoom.setThumbnailUrl(uploadedImageUrls.get(0));
            }
        } else {
            newRoom.setImageUrls(new ArrayList<>()); // Initialize an empty list if no images
        }

        Room savedRoom = roomRepository.save(newRoom);
        return roomMapper.toRoomResponse(savedRoom);
    }

    /**
     * Retrieves a room by its ID.
     * @param id The ID of the room.
     * @return RoomResponse DTO of the found room.
     * @throws EntityNotFoundException if the room is not found.
     */
    @Override
    public RoomResponse getRoomById(String id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Chambre non trouvée avec l'ID: " + id));
        return roomMapper.toRoomResponse(room);
    }

    /**
     * Retrieves all rooms.
     * @return A list of RoomResponse DTOs.
     */
    @Override
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(roomMapper::toRoomResponse)
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing room's information.
     * If newImageFiles are provided, they are ADDED to the existing image gallery.
     * Use addRoomImages/removeRoomImages for more granular control over images.
     * @param id The ID of the room to update.
     * @param request The RoomUpdateRequest DTO.
     * @param newImageFiles Optional list of new image files to add.
     * @return RoomResponse DTO of the updated room.
     * @throws EntityNotFoundException if the room is not found.
     */
    @Override
    @Transactional
    public RoomResponse updateRoom(String id, RoomUpdateRequest request, List<MultipartFile> newImageFiles) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Chambre non trouvée avec l'ID: " + id));

        // Update basic fields if provided in the request
        if (request.getTitle() != null) {
            existingRoom.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            existingRoom.setDescription(request.getDescription());
        }
        if (request.getRoomType() != null) {
            existingRoom.setRoomType(request.getRoomType());
        }
        if (request.getCapacity() != null) {
            existingRoom.setCapacity(request.getCapacity());
        }
        if (request.getSizeInSqMeters() != null) {
            existingRoom.setSizeInSqMeters(request.getSizeInSqMeters());
        }
        if (request.getFloor() != null) {
            existingRoom.setFloor(request.getFloor());
        }
        if (request.getBedConfiguration() != null) {
            existingRoom.setBedConfiguration(request.getBedConfiguration());
        }
        if (request.getViewType() != null) {
            existingRoom.setViewType(request.getViewType());
        }
        if (request.getBasePrice() != null) {
            existingRoom.setBasePrice(request.getBasePrice());
        }
        if (request.getWeekendPrice() != null) {
            existingRoom.setWeekendPrice(request.getWeekendPrice());
        }
        if (request.getOnSale() != null) {
            existingRoom.setOnSale(request.getOnSale());
        }
        if (request.getSalePrice() != null) {
            existingRoom.setSalePrice(request.getSalePrice());
        }
        if (request.getThumbnailUrl() != null) {
            existingRoom.setThumbnailUrl(request.getThumbnailUrl());
        }
        if (request.getAmenities() != null && !request.getAmenities().isEmpty()) {
            // This replaces existing amenities. If you want to add/remove, more complex logic is needed.
            existingRoom.setAmenities(new ArrayList<>(request.getAmenities()));
        }
        if (request.getRoomStatus() != null) {
            existingRoom.setRoomStatus(request.getRoomStatus());
        }
        if (request.getIsPublished() != null) {
            existingRoom.setIsPublished(request.getIsPublished());
        }
        if (request.getInternalNotes() != null) {
            existingRoom.setInternalNotes(request.getInternalNotes());
        }

        // Add new image files to the existing list
        if (newImageFiles != null && !newImageFiles.isEmpty()) {
            List<String> uploadedNewImageUrls = storageService.store(newImageFiles);
            if (existingRoom.getImageUrls() == null) {
                existingRoom.setImageUrls(new ArrayList<>());
            }
            existingRoom.getImageUrls().addAll(uploadedNewImageUrls);
            // Optionally, update thumbnail if none exists or if it's the first image
            if (existingRoom.getThumbnailUrl() == null && !uploadedNewImageUrls.isEmpty()) {
                existingRoom.setThumbnailUrl(uploadedNewImageUrls.get(0));
            }
        }
        
        Room updatedRoom = roomRepository.save(existingRoom);
        return roomMapper.toRoomResponse(updatedRoom);
    }

    /**
     * Deletes a room by its ID.
     * @param id The ID of the room to delete.
     * @throws EntityNotFoundException if the room is not found.
     */
    @Override
    @Transactional
    public void deleteRoom(String id) {
        if (!roomRepository.existsById(id)) {
            throw new EntityNotFoundException("Chambre non trouvée avec l'ID: " + id);
        }
        roomRepository.deleteById(id);
    }

    /**
     * Adds new images to an existing room's gallery.
     * @param roomId The ID of the room to which images will be added.
     * @param imageFiles A list of MultipartFile objects for the new images.
     * @return The updated list of image URLs for the room.
     * @throws EntityNotFoundException if the room is not found.
     * @throws IllegalArgumentException if no image files are provided.
     */
    @Override
    @Transactional
    public List<String> addRoomImages(String roomId, List<MultipartFile> imageFiles) {
        if (imageFiles == null || imageFiles.isEmpty()) {
            throw new IllegalArgumentException("Aucun fichier image fourni pour l'ajout.");
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Chambre non trouvée avec l'ID: " + roomId));

        List<String> uploadedUrls = storageService.store(imageFiles);
        if (room.getImageUrls() == null) {
            room.setImageUrls(new ArrayList<>());
        }
        room.getImageUrls().addAll(uploadedUrls);

        // If no thumbnail, set the first added image as thumbnail
        if (room.getThumbnailUrl() == null && !uploadedUrls.isEmpty()) {
            room.setThumbnailUrl(uploadedUrls.get(0));
        }

        roomRepository.save(room);
        return room.getImageUrls();
    }

    /**
     * Removes specific images from a room's gallery by their URLs.
     * @param roomId The ID of the room from which images will be removed.
     * @param imageUrlsToRemove A list of image URLs to be removed.
     * @return The updated list of image URLs for the room.
     * @throws EntityNotFoundException if the room is not found.
     */
    @Override
    @Transactional
    public List<String> removeRoomImages(String roomId, List<String> imageUrlsToRemove) {
        if (imageUrlsToRemove == null || imageUrlsToRemove.isEmpty()) {
            return roomRepository.findById(roomId)
                    .orElseThrow(() -> new EntityNotFoundException("Chambre non trouvée avec l'ID: " + roomId))
                    .getImageUrls(); // Nothing to remove, return current list
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Chambre non trouvée avec l'ID: " + roomId));

        if (room.getImageUrls() != null) {
            room.getImageUrls().removeAll(imageUrlsToRemove);
            // If the thumbnail URL was among the removed images, clear it.
            if (imageUrlsToRemove.contains(room.getThumbnailUrl())) {
                room.setThumbnailUrl(null);
            }
            // If all images are removed and thumbnail was also removed, maybe set a new thumbnail
            // from remaining images if any, or leave null. Current logic leaves it null.
        }

        roomRepository.save(room);
        return room.getImageUrls();
    }

    /**
     * Sets a specific image as the thumbnail for a room.
     * The image URL must already exist in the room's imageUrls list.
     * @param roomId The ID of the room.
     * @param thumbnailUrl The URL of the image to set as thumbnail.
     * @return The updated RoomResponse DTO.
     * @throws EntityNotFoundException if the room is not found.
     * @throws IllegalArgumentException if the provided thumbnail URL is not part of the room's existing images.
     */
    @Override
    @Transactional
    public RoomResponse setRoomThumbnail(String roomId, String thumbnailUrl) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Chambre non trouvée avec l'ID: " + roomId));

        // Ensure the provided thumbnail URL actually exists in the room's image gallery
        if (room.getImageUrls() == null || !room.getImageUrls().contains(thumbnailUrl)) {
            throw new IllegalArgumentException("L'URL de la miniature spécifiée n'existe pas dans la galerie d'images de la chambre.");
        }

        room.setThumbnailUrl(thumbnailUrl);
        Room updatedRoom = roomRepository.save(room);
        return roomMapper.toRoomResponse(updatedRoom);
    }
}
