package com.healthcare.appointment.controller;

import com.healthcare.appointment.entity.Admin;
import com.healthcare.appointment.service.IAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final IAdminService adminService;

    @GetMapping
    public ResponseEntity<List<Admin>> getAll() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getById(@PathVariable int id) {
        return ResponseEntity.ok(adminService.viewAdmin(id));
    }

    @PostMapping
    public ResponseEntity<Admin> add(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.addAdmin(admin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Admin> update(@PathVariable int id, @RequestBody Admin admin) {
        admin.setAdminId(id);
        return ResponseEntity.ok(adminService.updateAdmin(admin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        adminService.removeAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
