import axios, { AxiosError } from "axios";

export const POST = async (req: Request, res: Response) => {
  try {
    const formData = await req.formData();
    const ax = axios.create({
      withCredentials: true,
      baseURL: process.env.NEXT_PUBLIC_URL,
      headers: {
        Cookie: req.headers.get("Cookie"),
        "Content-Type":
          "multipart/form-data; boundary=<calculated when request is sent>",
      },
    });
    if (formData.get("image")) {
      const res = await ax.post(
        `${process.env.NEXT_PUBLIC_PNGSERVER_URL}/upload/photo`,
        formData
      );
      return new Response(JSON.stringify(res.data), { status: 200 });
    } else if (formData.getAll("images")) {
      const res = await ax.post(
        `${process.env.NEXT_PUBLIC_PNGSERVER_URL}/upload/photos`,
        formData
      );
      return new Response(JSON.stringify(res.data), { status: 200 });
    }
  } catch (error) {
    // console.log(error);
    const err = error as AxiosError;
    return new Response(JSON.stringify(err.response?.data), { status: 400 });
  }
};
