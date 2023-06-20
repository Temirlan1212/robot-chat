import { axiosClient } from "./api.config";

const assistantChatApi = {
  getAssistantResponse: async (payload: string) => {
    const formData = new FormData();
    formData.set("text", payload);

    try {
      const response = await axiosClient.post("/api", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error occurred while making the API request:", error);
      throw error;
    }
  },
};

export default assistantChatApi;
