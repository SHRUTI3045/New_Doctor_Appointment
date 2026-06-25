package com.healthcare.appointment.controller;

import com.healthcare.appointment.dto.LoginRequest;
import com.healthcare.appointment.dto.LoginResponse;
import com.healthcare.appointment.dto.RegisterRequest;
import com.healthcare.appointment.entity.Patient;
import com.healthcare.appointment.entity.User;
import com.healthcare.appointment.repository.UserRepository;
import com.healthcare.appointment.security.JwtUtil;
import com.healthcare.appointment.service.IPatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IPatientService patientService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUserName(), request.getPassword()));
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUserName());
        String token = jwtUtil.generateToken(userDetails);
        User user = userRepository.findByUserName(request.getUserName()).orElseThrow();
        String role = user.getRole();
        return ResponseEntity.ok(new LoginResponse(token, role, user.getUsername(), user.getUserId()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUserName(request.getUserName())) {
            return ResponseEntity.badRequest().body("Username already taken");
        }
        User user = new User();
        user.setUserName(request.getUserName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "PATIENT");
        userRepository.save(user);

        if ("PATIENT".equals(user.getRole())) {
            Patient patient = new Patient();
            patient.setPatientName(request.getPatientName());
            patient.setEmail(request.getEmail());
            patient.setMobileNo(request.getMobileNo());
            patient.setBloodGroup(request.getBloodGroup());
            patient.setGender(request.getGender());
            patient.setAge(request.getAge());
            patient.setAddress(request.getAddress());
            patient.setPassword(passwordEncoder.encode(request.getPassword()));
            patientService.addPatient(patient);
        }

        return ResponseEntity.ok("Registered successfully");
    }
}
