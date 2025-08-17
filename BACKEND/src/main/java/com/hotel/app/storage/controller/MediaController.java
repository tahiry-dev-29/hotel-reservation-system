// src/main/java/com/hotel/app/storage/controller/MediaController.java
package com.hotel.app.storage.controller;

import com.hotel.app.storage.service.StorageService; // Import your StorageService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/media") // This maps to http://localhost:8080/api/media
public class MediaController {

    private final Path rootLocation = Paths.get("uploads"); // Must match your FileSystemStorageService's rootLocation

    // Constructor to ensure the directory exists
    public MediaController() {
        try {
            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory for MediaController", e);
        }
    }

    /**
     * Serves image files by their filename.
     * Accessible publicly because /api/media/** is permitted in SecurityConfig.
     *
     * @param filename The unique filename of the image.
     * @return ResponseEntity containing the image resource.
     */
    @GetMapping("/{filename:.+}") // Regex to allow filenames with dots (e.g., image.png)
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                // Determine content type dynamically (optional, but good practice)
                String contentType = null;
                try {
                    contentType = Files.probeContentType(file);
                } catch (IOException e) {
                    // Fallback if content type cannot be determined
                    System.err.println("Could not determine file type for: " + filename);
                }

                if (contentType == null) {
                    contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE; // Default to binary stream
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build(); // File not found
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build(); // Invalid URL
        } catch (Exception e) {
            // Log the actual exception for debugging purposes
            e.printStackTrace();
            return ResponseEntity.internalServerError().build(); // Generic error
        }
    }
}
