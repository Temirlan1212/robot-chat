import { IGetBinaryTreeAnswersResponse } from "shared/types/chatBot";
import { axiosClient } from "./api.config";
import { getItem } from "services/localStorage.service";

const assistantChatApi = {
  getAssistantResponse: async (payload: string) => {
    const formData = new FormData();
    formData.set("text", payload);

    try {
      const response = await axiosClient.post("/api/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error occurred while making the API request:", error);
      throw error;
    }
  },

  getBinaryTreeAnswers: async (id: number) => {
    let lang = getItem("i18nextLng");
    if (lang == null) lang = "ru";

    try {
      const response = await axiosClient.get<IGetBinaryTreeAnswersResponse>(
        `/api/${id}/`,
        {
          headers: { "Accept-Language": lang },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error occurred while making the API request:", error);
    }
  },
};

export default assistantChatApi;
function getCookie(arg0: string) {
  throw new Error("Function not implemented.");
}
