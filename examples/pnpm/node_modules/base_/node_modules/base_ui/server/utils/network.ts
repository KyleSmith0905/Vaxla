import { networkInterfaces } from "os";

export const getPrimaryIp = () => {
  const ip = Object.values(networkInterfaces())
    .flat()
    .find((details) => {
      if (!details) return false;
      else if (details.family !== "IPv4") return false;
      else if (details.internal === true) return false;
      else if (!details.address.startsWith("192")) return false;
      return true;
    });

  return ip;
};
