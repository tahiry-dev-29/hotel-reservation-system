package com.hotel.app.room.model;

public enum RoomStatus {
    AVAILABLE,   // Room is ready for occupancy
    OCCUPIED,    // Room is currently occupied by a guest
    MAINTENANCE, // Room is out of service for maintenance
    CLEANING     // Room is currently being cleaned
}