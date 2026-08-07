import { emailService } from "./email.service.js";
import {
  emailTemplates,
  type OrderNotificationPayload,
  type UserNotificationPayload,
} from "../templates/email-templates.js";

export class NotificationService {
  async notifyUserWelcome(user: UserNotificationPayload) {
    if (!user.email) return;

    const html = emailTemplates.welcomeHtml(user);
    await emailService.sendEmail({
      to: user.email,
      subject: "Welcome to Samud Shabkat!",
      html,
    });
  }

  async notifyOrderPlaced(
    order: OrderNotificationPayload,
    user: UserNotificationPayload,
  ) {
    if (!user.email) return;

    const html = emailTemplates.orderConfirmationHtml(order, user);
    await emailService.sendEmail({
      to: user.email,
      subject: `Order Confirmation - #${order.orderNumber}`,
      html,
    });
  }

  async notifyOrderStatusChanged(
    order: OrderNotificationPayload,
    user: UserNotificationPayload,
    newStatus: string,
  ) {
    if (!user.email) return;

    if (newStatus === "READY_FOR_PICKUP") {
      const html = emailTemplates.readyForPickupHtml(order, user);
      await emailService.sendEmail({
        to: user.email,
        subject: `Your Order #${order.orderNumber} is Ready for Store Pickup!`,
        html,
      });
    } else if (newStatus === "OUT_FOR_DELIVERY") {
      const html = emailTemplates.outForDeliveryHtml(order, user);
      await emailService.sendEmail({
        to: user.email,
        subject: `Your Order #${order.orderNumber} is Out for Delivery!`,
        html,
      });
    }
  }

  async notifyCashCollected(
    order: OrderNotificationPayload,
    user: UserNotificationPayload,
  ) {
    if (!user.email) return;

    const html = emailTemplates.cashCollectedHtml(order, user);
    await emailService.sendEmail({
      to: user.email,
      subject: `Payment Receipt for Order #${order.orderNumber}`,
      html,
    });
  }
}

export const notificationService = new NotificationService();
