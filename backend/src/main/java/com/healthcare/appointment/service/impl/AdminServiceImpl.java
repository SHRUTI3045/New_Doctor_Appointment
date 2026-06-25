package com.healthcare.appointment.service.impl;

import com.healthcare.appointment.entity.Admin;
import com.healthcare.appointment.repository.AdminRepository;
import com.healthcare.appointment.service.IAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements IAdminService {

    private final AdminRepository adminRepository;

    @Override
    public Admin addAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    @Override
    public Admin updateAdmin(Admin admin) {
        adminRepository.findById(admin.getAdminId())
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + admin.getAdminId()));
        return adminRepository.save(admin);
    }

    @Override
    public void removeAdmin(int adminId) {
        adminRepository.deleteById(adminId);
    }

    @Override
    public Admin viewAdmin(int adminId) {
        return adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + adminId));
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }
}
