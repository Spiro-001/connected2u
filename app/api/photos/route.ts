import axios, { AxiosError } from "axios";

export const POST = async (req: Request, res: Response) => {
  try {
    const { id, type } = await req.json();
    const ax = axios.create({
      withCredentials: true,
      baseURL: process.env.NEXT_PUBLIC_URL,
      headers: {
        Cookie: req.headers.get("Cookie"),
      },
    });
    const res = await ax.post(
      `${process.env.NEXT_PUBLIC_PNGSERVER_URL}/get/photos/${id}/${type}`
    );

    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (error) {
    // console.log(error);
    const err = error as AxiosError;
    return new Response(JSON.stringify(err.response?.data), { status: 400 });
  }
};
