import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
  try {
    const { id, sessionToken } = await req.json();
    const ax = axios.create({
      withCredentials: true,
      baseURL: process.env.NEXT_PUBLIC_URL,
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_PNGSERVER_URL}/auth/validate`,
      {
        id,
        sessionToken,
      }
    );
    const response = NextResponse.json(res.data, { status: 200 });
    if (!res.data.validate) {
      // Failed validation needs new sessionToken
      response.cookies.delete("CONNECTED2U_AUTH_TOKEN");
      return response;
    }
    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (error) {
    // console.log(error);
    const err = error as AxiosError;
    return new Response(JSON.stringify(err.response?.data), {
      status: err.response?.status ?? 400,
    });
  }
};
