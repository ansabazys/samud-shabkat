export declare const ROLES: {
  readonly SUPER_ADMIN: "SUPER_ADMIN";
  readonly ADMIN: "ADMIN";
  readonly STAFF: "STAFF";
  readonly DELIVERY_BOY: "DELIVERY_BOY";
  readonly CUSTOMER: "CUSTOMER";
};
export type Role = (typeof ROLES)[keyof typeof ROLES];
export declare const PERMISSIONS: {
  readonly DASHBOARD_VIEW: "dashboard.view";
  readonly PRODUCTS_VIEW: "products.view";
  readonly PRODUCTS_CREATE: "products.create";
  readonly PRODUCTS_UPDATE: "products.update";
  readonly PRODUCTS_DELETE: "products.delete";
  readonly CATEGORIES_VIEW: "categories.view";
  readonly CATEGORIES_CREATE: "categories.create";
  readonly CATEGORIES_UPDATE: "categories.update";
  readonly CATEGORIES_DELETE: "categories.delete";
  readonly BRANDS_VIEW: "brands.view";
  readonly BRANDS_CREATE: "brands.create";
  readonly BRANDS_UPDATE: "brands.update";
  readonly BRANDS_DELETE: "brands.delete";
  readonly CUSTOMERS_VIEW: "customers.view";
  readonly CUSTOMERS_UPDATE: "customers.update";
  readonly ORDERS_VIEW: "orders.view";
  readonly ORDERS_UPDATE: "orders.update";
  readonly ORDERS_PAYMENT: "orders.payment";
  readonly ADMINS_VIEW: "admins.view";
  readonly ADMINS_CREATE: "admins.create";
  readonly ADMINS_UPDATE: "admins.update";
  readonly ADMINS_DELETE: "admins.delete";
  readonly SETTINGS_VIEW: "settings.view";
  readonly SETTINGS_UPDATE: "settings.update";
};
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export declare const ORDER_STATUS: {
  readonly PENDING: "PENDING";
  readonly CONFIRMED: "CONFIRMED";
  readonly PROCESSING: "PROCESSING";
  readonly READY_FOR_COLLECTION: "READY_FOR_COLLECTION";
  readonly READY_FOR_PICKUP: "READY_FOR_PICKUP";
  readonly OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY";
  readonly DELIVERED: "DELIVERED";
  readonly COMPLETED: "COMPLETED";
  readonly CANCELLED: "CANCELLED";
};
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export declare const PAYMENT_STATUS: {
  readonly PENDING: "PENDING";
  readonly PAID: "PAID";
  readonly FAILED: "FAILED";
  readonly REFUNDED: "REFUNDED";
};
export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
export declare const FULFILLMENT_TYPE: {
  readonly STORE_PICKUP: "STORE_PICKUP";
  readonly HOME_DELIVERY: "HOME_DELIVERY";
};
export type FulfillmentType =
  (typeof FULFILLMENT_TYPE)[keyof typeof FULFILLMENT_TYPE];
export declare const PAYMENT_METHOD: {
  readonly CASH_ON_DELIVERY: "CASH_ON_DELIVERY";
  readonly CASH_ON_PICKUP: "CASH_ON_PICKUP";
  readonly CASH: "CASH";
};
export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];
//# sourceMappingURL=index.d.ts.map
