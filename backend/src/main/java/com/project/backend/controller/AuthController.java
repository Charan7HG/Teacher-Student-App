package com.project.backend.controller;


import com.project.backend.dto.LoginRequest;
import com.project.backend.entity.Teacher;
import com.project.backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public Teacher login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
