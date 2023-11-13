export const parsePusher = async (body: ReadableStream) => {
  let object: Record<string, string> = {};
  const textData = await new Response(body).text();
  textData.split("&").forEach((item) => {
    const [key, value] = item.split("=");
    object[key as keyof object] = value;
  });
  return object;
};
