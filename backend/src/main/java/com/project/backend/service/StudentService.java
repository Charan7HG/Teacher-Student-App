package com.project.backend.service;


import com.project.backend.dto.StudentRequest;
import com.project.backend.entity.Student;
import com.project.backend.exception.DuplicateStudentException;
import com.project.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student registerStudent(StudentRequest request) {

        if (studentRepository.findByStudentEmail(request.getStudentEmail()).isPresent()) {
            throw new DuplicateStudentException("Student email already exists");
        }

        Student student = new Student();

        student.setStudentName(request.getStudentName());
        student.setStudentEmail(request.getStudentEmail());
        student.setPhone(request.getPhone());
        student.setGender(request.getGender());
        student.setCourse(request.getCourse());
        student.setSection(request.getSection());
        student.setSkills(request.getSkills());
        student.setDob(request.getDob());
        student.setCity(request.getCity());
        student.setAddress(request.getAddress());

        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    public Student updateStudent(Long id, StudentRequest request) {

    Student student = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found"));

    student.setStudentName(request.getStudentName());
    student.setStudentEmail(request.getStudentEmail());
    student.setPhone(request.getPhone());
    student.setGender(request.getGender());
    student.setCourse(request.getCourse());
    student.setSection(request.getSection());
    student.setSkills(request.getSkills());
    student.setDob(request.getDob());
    student.setCity(request.getCity());
    student.setAddress(request.getAddress());

    return studentRepository.save(student);
}
public void deleteStudent(Long id) {

    if (!studentRepository.existsById(id)) {
        throw new RuntimeException("Student not found");
    }

    studentRepository.deleteById(id);
}
public Student getStudentById(Long id) {

    return studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found"));
}
}
