package com.hotel.app.storage.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileSystemStorageService implements StorageService {

    private final Path rootLocation = Paths.get("uploads"); // The directory to store files.

    // Initialize the storage directory.
    public FileSystemStorageService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    @Override
    public List<String> store(List<MultipartFile> files) {
        return files.stream()
                .map(this::saveFile) // Call saveFile for each file in the list.
                .collect(Collectors.toList());
    }

    private String saveFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }
        try {
            // Generate a unique filename to avoid collisions.
            String uniqueFilename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.rootLocation.resolve(uniqueFilename));
            return uniqueFilename; // Return the new filename.
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }
}