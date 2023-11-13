import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
  try {
    const formData = await req.formData();
    const ax = axios.create({
      baseURL: process.env.NEXT_PUBLIC_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await ax.post(
      `${process.env.NEXT_PUBLIC_PNGSERVER_URL}/auth/login`,
      formData
    );
    const response = NextResponse.json(result.data, { status: 200 });
    response.cookies.set(
      "CONNECTED2U_AUTH_TOKEN",
      result.data.authentication.sessionToken
    );
    return response;
  } catch (error) {
    // console.log(error);
    const err = error as AxiosError;
    return new Response(JSON.stringify(err.response?.data), { status: 400 });
  }
};
