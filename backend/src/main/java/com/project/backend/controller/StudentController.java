package com.project.backend.controller;


import com.project.backend.dto.StudentRequest;
import com.project.backend.entity.Student;
import com.project.backend.exception.DuplicateStudentException;
import com.project.backend.service.StudentService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public Student registerStudent(@RequestBody StudentRequest request) {
        return studentService.registerStudent(request);
    }

    @ExceptionHandler(DuplicateStudentException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public String handleDuplicateStudent(DuplicateStudentException ex) {
        return ex.getMessage();
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }
    @PutMapping("/{id}")
public Student updateStudent(
        @PathVariable Long id,
        @RequestBody StudentRequest request) {

    return studentService.updateStudent(id, request);
}
@DeleteMapping("/{id}")
public String deleteStudent(@PathVariable Long id) {

    studentService.deleteStudent(id);

    return "Student deleted successfully";
}
@GetMapping("/{id}")
public Student getStudentById(@PathVariable Long id) {

    return studentService.getStudentById(id);
}
}