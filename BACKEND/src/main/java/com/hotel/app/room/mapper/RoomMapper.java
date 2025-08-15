package com.hotel.app.room.mapper;

import com.hotel.app.room.dto.RoomRegistrationRequest;
import com.hotel.app.room.dto.RoomResponse;
import com.hotel.app.room.model.Room;
import org.springframework.stereotype.Component;

/**
 * Mapper component to convert between Room entity and Room DTOs.
 */
@Component
public class RoomMapper {

    /**
     * Converts a Room entity to a RoomResponse DTO.
     * @param room The Room entity to convert.
     * @return The corresponding RoomResponse DTO.
     */
    public RoomResponse toRoomResponse(Room room) {
        if (room == null) {
            return null;
        }
        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .title(room.getTitle())
                .description(room.getDescription())
                .roomType(room.getRoomType())
                .capacity(room.getCapacity())
                .sizeInSqMeters(room.getSizeInSqMeters())
                .floor(room.getFloor())
                .bedConfiguration(room.getBedConfiguration())
                .viewType(room.getViewType())
                .basePrice(room.getBasePrice())
                .weekendPrice(room.getWeekendPrice())
                .onSale(room.getOnSale())
                .salePrice(room.getSalePrice())
                .imageUrls(room.getImageUrls())
                .thumbnailUrl(room.getThumbnailUrl())
                .amenities(room.getAmenities())
                .roomStatus(room.getRoomStatus())
                .isPublished(room.getIsPublished())
                .internalNotes(room.getInternalNotes())
                .build();
    }

    /**
     * Converts a RoomRegistrationRequest DTO to a Room entity.
     * @param request The RoomRegistrationRequest DTO to convert.
     * @return The corresponding Room entity.
     */
    public Room toRoomEntity(RoomRegistrationRequest request) {
        if (request == null) {
            return null;
        }
        Room room = new Room();
        room.setRoomNumber(request.getRoomNumber());
        room.setTitle(request.getTitle());
        room.setDescription(request.getDescription());
        room.setRoomType(request.getRoomType());
        room.setCapacity(request.getCapacity());
        room.setSizeInSqMeters(request.getSizeInSqMeters());
        room.setFloor(request.getFloor());
        room.setBedConfiguration(request.getBedConfiguration());
        room.setViewType(request.getViewType());
        room.setBasePrice(request.getBasePrice());
        room.setWeekendPrice(request.getWeekendPrice());
        room.setOnSale(request.getOnSale());
        room.setSalePrice(request.getSalePrice());
        // Image URLs are handled separately in the service
        // Thumbnail URL will be set by the service
        room.setAmenities(request.getAmenities());
        room.setRoomStatus(request.getRoomStatus());
        room.setIsPublished(request.getIsPublished());
        room.setInternalNotes(request.getInternalNotes());
        return room;
    }
}
