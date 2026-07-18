package com.healthcare.appointment.service.impl;

import com.healthcare.appointment.entity.Notification;
import com.healthcare.appointment.repository.NotificationRepository;
import com.healthcare.appointment.service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements INotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public Notification addNotification(Integer userId, String message, String type, Integer appointmentId) {
        if (userId == null) {
            return null;
        }
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setType(type);
        notification.setAppointmentId(appointmentId);
        notification.setRead(false);
        notification.setCreatedAt(Instant.now());
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getByUser(Integer userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public long getUnreadCount(Integer userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Override
    public Notification markRead(int notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    public void markAllRead(Integer userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalse(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
