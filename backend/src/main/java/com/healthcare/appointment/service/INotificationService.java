package com.healthcare.appointment.service;

import com.healthcare.appointment.entity.Notification;

import java.util.List;

public interface INotificationService {
    Notification addNotification(Integer userId, String message, String type, Integer appointmentId);
    List<Notification> getByUser(Integer userId);
    long getUnreadCount(Integer userId);
    Notification markRead(int notificationId);
    void markAllRead(Integer userId);
}
