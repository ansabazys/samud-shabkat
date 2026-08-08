export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  DELIVERY_BOY: "DELIVERY_BOY",
  CUSTOMER: "CUSTOMER",
};
export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",
  PRODUCTS_VIEW: "products.view",
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_UPDATE: "products.update",
  PRODUCTS_DELETE: "products.delete",
  CATEGORIES_VIEW: "categories.view",
  CATEGORIES_CREATE: "categories.create",
  CATEGORIES_UPDATE: "categories.update",
  CATEGORIES_DELETE: "categories.delete",
  BRANDS_VIEW: "brands.view",
  BRANDS_CREATE: "brands.create",
  BRANDS_UPDATE: "brands.update",
  BRANDS_DELETE: "brands.delete",
  CUSTOMERS_VIEW: "customers.view",
  CUSTOMERS_UPDATE: "customers.update",
  ORDERS_VIEW: "orders.view",
  ORDERS_UPDATE: "orders.update",
  ORDERS_PAYMENT: "orders.payment",
  ADMINS_VIEW: "admins.view",
  ADMINS_CREATE: "admins.create",
  ADMINS_UPDATE: "admins.update",
  ADMINS_DELETE: "admins.delete",
  SETTINGS_VIEW: "settings.view",
  SETTINGS_UPDATE: "settings.update",
};
export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PROCESSING: "PROCESSING",
  READY_FOR_COLLECTION: "READY_FOR_COLLECTION",
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};
export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};
export const FULFILLMENT_TYPE = {
  STORE_PICKUP: "STORE_PICKUP",
  HOME_DELIVERY: "HOME_DELIVERY",
};
export const PAYMENT_METHOD = {
  CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
  CASH_ON_PICKUP: "CASH_ON_PICKUP",
  CASH: "CASH",
};
