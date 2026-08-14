import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, writeBatch, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase";

export type NotificationType = 'security' | 'theft_alert' | 'transfer' | 'registry' | 'info' | 'warning';
export type NotificationPriority = 'critical' | 'high' | 'normal';

export interface AppNotification {
  id?: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  userId?: string;          // Specific user ID, or 'all' for broadcasts
  recipient?: string;       // Email or target
  read?: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

/**
 * Sends a real-time notification persisted directly to Firestore.
 */
export async function sendNotification(notif: Omit<AppNotification, 'createdAt'>): Promise<string> {
  try {
    const newDoc = {
      ...notif,
      read: notif.read ?? false,
      priority: notif.priority || 'normal',
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "notifications"), newDoc);
    return docRef.id;
  } catch (err) {
    console.error("Error creating notification in Firestore:", err);
    throw err;
  }
}

/**
 * Marks a specific notification as read in Firestore.
 */
export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    const notifRef = doc(db, "notifications", id);
    await updateDoc(notifRef, { read: true });
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
  }
}

/**
 * Marks all given notification IDs as read.
 */
export async function markAllNotificationsAsRead(ids: string[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      const notifRef = doc(db, "notifications", id);
      batch.update(notifRef, { read: true });
    });
    await batch.commit();
  } catch (err) {
    console.error("Failed to batch mark notifications as read:", err);
  }
}

/**
 * Deletes a notification from Firestore.
 */
export async function deleteNotification(id: string): Promise<void> {
  try {
    const notifRef = doc(db, "notifications", id);
    await deleteDoc(notifRef);
  } catch (err) {
    console.error("Failed to delete notification:", err);
  }
}
