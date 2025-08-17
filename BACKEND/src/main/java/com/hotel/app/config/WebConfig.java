package com.hotel.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String uploadDirectory = "file:./uploads/";
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Le chemin public sous lequel les images seront accessibles
        // Ici, elles seront accessibles via http://localhost:8080/images/{nom_fichier}
        registry.addResourceHandler("/images/**")
                .addResourceLocations(uploadDirectory);
    }
}
