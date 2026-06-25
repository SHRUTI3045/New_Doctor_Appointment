package com.healthcare.appointment.service;

import com.healthcare.appointment.entity.Admin;

import java.util.List;

public interface IAdminService {
    Admin addAdmin(Admin admin);
    Admin updateAdmin(Admin admin);
    void removeAdmin(int adminId);
    Admin viewAdmin(int adminId);
    List<Admin> getAllAdmins();
}
