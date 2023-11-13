import { useCookies } from "next-client-cookies";

export const useGetSessionTokenClient = () => {
  return useCookies().get("CONNECTED2U_AUTH_TOKEN");
};
