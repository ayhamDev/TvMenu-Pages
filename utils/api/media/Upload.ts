import { IMedia } from "@/interface/Media.interface";
import { Sleep } from "@/lib/Sleep";
import api from "@/utils/Api";
import { CleanPromise } from "@/utils/CleanPromise";
import { AxiosError, AxiosResponse } from "axios";

export const Upload = async (
  title: string,
  file: File,
  clientId: string | undefined | null
) => {
  const UploadForm = new FormData();
  if (title) {
    UploadForm.set("title", title);
  }
  if (clientId) {
    UploadForm.set("clientId", clientId);
  }
  UploadForm.set("file", file);

  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: number; data: IMedia }>,
    AxiosError<{ message: string; statusCode: number }>
  >(api.post(`/media`, UploadForm).then((res) => res.data));
};
