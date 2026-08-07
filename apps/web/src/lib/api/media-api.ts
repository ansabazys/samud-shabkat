import { api } from "../api";

export interface UploadedMedia {
  id: string;
  key: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  folder: string;
  createdAt: string;
}

export const mediaApi = {
  async uploadSingle(file: File, folder = "products"): Promise<UploadedMedia> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post<{ success: boolean; data: UploadedMedia }>(
      `/media/upload?folder=${folder}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data.data;
  },

  async uploadMultiple(
    files: File[],
    folder = "products",
  ): Promise<UploadedMedia[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await api.post<{ success: boolean; data: UploadedMedia[] }>(
      `/media/upload-multiple?folder=${folder}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data.data;
  },
};
