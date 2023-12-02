import axios, { AxiosError } from "axios";

export const GET = async (req: Request, res: Response) => {
  try {
    const ax = axios.create({
      withCredentials: true,
      baseURL: process.env.NEXT_PUBLIC_URL,
      headers: {
        Cookie: req.headers.get("Cookie"),
      },
    });
    const res = await ax.get(`${process.env.NEXT_PUBLIC_PNGSERVER_URL}/users`);

    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (error) {
    // console.log(error);
    const err = error as AxiosError;
    return new Response(JSON.stringify(err.response?.data), {
      status: err.response?.status ?? 403,
    });
  }
};
