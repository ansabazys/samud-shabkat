import { api } from "../api";

export interface SystemSettings {
  companyName?: string;
  supportEmail?: string;
  contactPhone?: string;
  officeAddress?: string;
  defaultCurrency?: string;
  isMaintenanceMode?: boolean;
}

export const settingsApi = {
  async getSettings(): Promise<SystemSettings> {
    const res = await api.get<{ success: boolean; data: SystemSettings }>(
      "/settings",
    );
    return res.data.data;
  },

  async updateSettings(input: SystemSettings): Promise<SystemSettings> {
    const res = await api.put<{ success: boolean; data: SystemSettings }>(
      "/settings",
      input,
    );
    return res.data.data;
  },
};
