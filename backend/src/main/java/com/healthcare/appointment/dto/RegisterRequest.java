package com.healthcare.appointment.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String userName;
    private String password;
    private String role;
    // Patient fields
    private String patientName;
    private String mobileNo;
    private String email;
    private String bloodGroup;
    private String gender;
    private int age;
    private String address;
}
