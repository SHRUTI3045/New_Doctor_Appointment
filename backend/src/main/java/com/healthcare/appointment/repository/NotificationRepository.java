package com.healthcare.appointment.repository;

import com.healthcare.appointment.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Integer userId);
    long countByUserIdAndReadFalse(Integer userId);
    List<Notification> findByUserIdAndReadFalse(Integer userId);
}
