package com.hotel.app.storage.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface StorageService {
    // Method to store a list of files.
    List<String> store(List<MultipartFile> files);

    // New method to store a single file.
    String store(MultipartFile file);
}
