import { getPrimaryIp } from "~~/server/utils/network";

export default defineEventHandler(() => {
  const ip = getPrimaryIp();
  return ip?.address ?? "";
});
