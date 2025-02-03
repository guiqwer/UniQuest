package com.Uniquest.UniQuest.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        // Permite que as requisições funcionem com ou sem a barra no final
        configurer.setUseTrailingSlashMatch(true);
    }
}