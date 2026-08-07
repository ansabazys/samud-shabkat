export interface OrderNotificationPayload {
  id: string;
  orderNumber: string;
  totalAmount: string;
  fulfillmentType: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  contactPhone?: string | null;
  shippingAddress?: string | null;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
  }>;
}

export interface UserNotificationPayload {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

export const emailTemplates = {
  welcomeHtml(user: UserNotificationPayload) {
    const name = user.firstName ? ` ${user.firstName}` : "";
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
            .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; }
            .title { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; }
            .btn { display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 20px; }
            .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1 class="title">Welcome to Samud Shabkat! 🌊</h1>
            </div>
            <p>Hello${name},</p>
            <p>Thank you for creating an account with Samud Shabkat E-Commerce. We are thrilled to have you on board!</p>
            <p>You can now browse our full product catalog, place takeaway orders for store pickup, or choose Cash on Delivery for home orders.</p>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Samud Shabkat. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  orderConfirmationHtml(
    order: OrderNotificationPayload,
    user: UserNotificationPayload,
  ) {
    const name = user.firstName ? ` ${user.firstName}` : "";
    const isTakeaway = order.fulfillmentType === "STORE_PICKUP";

    const itemsTable = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${item.productName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: right;">₹${item.unitPrice}</td>
          <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600;">₹${item.totalPrice}</td>
        </tr>
      `,
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; }
            .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 20px; }
            .badge { display: inline-block; background-color: #e0f2fe; color: #0369a1; font-weight: 600; padding: 4px 12px; border-radius: 16px; font-size: 13px; }
            .details { background-color: #f8fafc; border-radius: 8px; padding: 16px; margin: 20px 0; }
            .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            .total { text-align: right; font-size: 18px; font-weight: 700; color: #0284c7; margin-top: 16px; }
            .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <span class="badge">${isTakeaway ? "STORE TAKEAWAY" : "CASH ON DELIVERY"}</span>
              <h2 style="margin: 8px 0 0 0; font-size: 22px;">Order Placed: ${order.orderNumber}</h2>
            </div>
            <p>Hi${name},</p>
            <p>Thank you for your order! We have received your order and are processing it.</p>
            
            <div class="details">
              <strong>Fulfillment Type:</strong> ${isTakeaway ? "Store Pickup (Pay at Counter)" : "Home Delivery (Cash on Delivery)"}<br>
              <strong>Payment Method:</strong> ${order.paymentMethod}<br>
              ${!isTakeaway && order.shippingAddress ? `<strong>Shipping Address:</strong> ${order.shippingAddress}<br>` : ""}
            </div>

            <table class="table">
              <thead>
                <tr style="background-color: #f1f5f9; text-align: left; font-size: 13px; color: #64748b;">
                  <th style="padding: 10px;">Item</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                  <th style="padding: 10px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTable}
              </tbody>
            </table>

            <div class="total">
              Total Amount: ₹${order.totalAmount}
            </div>

            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Samud Shabkat. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  readyForPickupHtml(
    order: OrderNotificationPayload,
    user: UserNotificationPayload,
  ) {
    const name = user.firstName ? ` ${user.firstName}` : "";
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; }
            .header { border-bottom: 2px solid #16a34a; padding-bottom: 16px; margin-bottom: 20px; }
            .badge { display: inline-block; background-color: #dcfce7; color: #15803d; font-weight: 700; padding: 6px 14px; border-radius: 16px; font-size: 14px; }
            .box { background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <span class="badge">READY FOR STORE PICKUP</span>
              <h2 style="margin: 8px 0 0 0; color: #15803d;">Order #${order.orderNumber} is Ready!</h2>
            </div>
            <p>Hi${name},</p>
            <div class="box">
              <h3 style="margin-top:0; color:#166534;">Store Pickup Instructions</h3>
              <p style="margin:0;">Your order has been packed and is waiting for you at our store counter.</p>
              <p style="margin-top: 10px; font-weight: 600;">Amount Due at Counter: ₹${order.totalAmount} (Cash)</p>
            </div>
            <p>Please mention your order number <strong>${order.orderNumber}</strong> when you arrive at the counter.</p>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Samud Shabkat. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  outForDeliveryHtml(
    order: OrderNotificationPayload,
    user: UserNotificationPayload,
  ) {
    const name = user.firstName ? ` ${user.firstName}` : "";
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; }
            .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 20px; }
            .badge { display: inline-block; background-color: #e0f2fe; color: #0369a1; font-weight: 700; padding: 6px 14px; border-radius: 16px; font-size: 14px; }
            .box { background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <span class="badge">OUT FOR DELIVERY 🚚</span>
              <h2 style="margin: 8px 0 0 0;">Order #${order.orderNumber} is on the way!</h2>
            </div>
            <p>Hi${name},</p>
            <div class="box">
              <h3 style="margin-top:0; color:#0369a1;">Cash on Delivery Notice</h3>
              <p style="margin:0;">Our delivery boy is currently en route to your shipping address.</p>
              <p style="margin-top: 10px; font-weight: 600; font-size: 16px; color: #0284c7;">Total Cash to Pay: ₹${order.totalAmount}</p>
            </div>
            <p>Please keep exact cash ready for a swift delivery experience!</p>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Samud Shabkat. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  cashCollectedHtml(
    order: OrderNotificationPayload,
    user: UserNotificationPayload,
  ) {
    const name = user.firstName ? ` ${user.firstName}` : "";
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; }
            .header { border-bottom: 2px solid #16a34a; padding-bottom: 16px; margin-bottom: 20px; }
            .badge { display: inline-block; background-color: #dcfce7; color: #15803d; font-weight: 700; padding: 6px 14px; border-radius: 16px; font-size: 14px; }
            .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <span class="badge">PAYMENT RECEIVED ✓</span>
              <h2 style="margin: 8px 0 0 0; color: #15803d;">Cash Receipt for Order #${order.orderNumber}</h2>
            </div>
            <p>Hi${name},</p>
            <p>We have successfully received cash payment of <strong>₹${order.totalAmount}</strong> for your order <strong>#${order.orderNumber}</strong>.</p>
            <p>Thank you for shopping with Samud Shabkat!</p>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Samud Shabkat. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  },
};
