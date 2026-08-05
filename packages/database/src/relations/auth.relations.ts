import { relations } from "drizzle-orm";
import {
  users,
  roles,
  permissions,
  userRoles,
  rolePermissions,
} from "../schema/auth.js";
import { customerProfiles } from "../schema/customers.js";
import { orders } from "../schema/orders.js";

export const usersRelations = relations(users, ({ one, many }) => ({
  customerProfile: one(customerProfiles),
  userRoles: many(userRoles),
  orders: many(orders),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);

export const customerProfilesRelations = relations(
  customerProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [customerProfiles.userId],
      references: [users.id],
    }),
  }),
);
