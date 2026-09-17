package com.project.backend.service;

import com.project.backend.dto.LoginRequest;
import com.project.backend.entity.Teacher;
import com.project.backend.repository.TeacherRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final TeacherRepository teacherRepository;

    public AuthService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    public Teacher login(LoginRequest request) {

        Teacher teacher = teacherRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Email not found"));

        if (!teacher.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return teacher;
    }
}
