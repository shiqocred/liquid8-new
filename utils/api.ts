import axios from "axios";

export const getData = async (token: string, url: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_baseUrl}${url}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const postData = async (token: string, url: string, data:string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_baseUrl}${url}`, data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      if (error) {
        return { error: error };
      }
      return { error: "An unknown error occurred" };
    }
  };