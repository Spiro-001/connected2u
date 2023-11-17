import axios, { AxiosError } from "axios";

export const GET = async (req: Request, res: Response) => {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);

    const id = searchParams.get("id");
    const type = searchParams.get("type");
    const key = searchParams.get("key");

    const ax = axios.create({
      withCredentials: true,
      baseURL: process.env.NEXT_PUBLIC_URL,
      headers: {
        Cookie: req.headers.get("Cookie"),
      },
    });
    const res = await ax.get(
      `${process.env.NEXT_PUBLIC_PNGSERVER_URL}/get/photo/${id}/${type}/${key}`
    );
    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (error) {
    // console.log(error);
    const err = error as AxiosError;
    return new Response(JSON.stringify(err.response?.data), { status: 400 });
  }
};
