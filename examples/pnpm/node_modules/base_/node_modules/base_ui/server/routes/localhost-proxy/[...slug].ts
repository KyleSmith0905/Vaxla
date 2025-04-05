import { getPrimaryIp } from "~~/server/utils/network";

export default defineEventHandler(async (event) => {
  const ip = getPrimaryIp();

  const params = event.context.params;

  const response = await fetch(
    `http://${ip?.address ?? "localhost"}:${params?.slug}`,
  ).catch(() => ({ ok: false }));

  return response.ok;
});
