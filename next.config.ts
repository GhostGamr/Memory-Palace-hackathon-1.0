import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

/**
 * Next 16 blocks cross-origin requests to dev resources (HMR sockets, the
 * turbopack client) by default. Opening the app on 127.0.0.1 or the LAN address
 * instead of localhost trips that guard, React never hydrates, and the only thing
 * left on screen is the server rendered HUD with an empty 3D layer.
 */
const localAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
  .map((entry) => entry.address)
  .filter((address) => !address.startsWith("127."));

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["localhost", "127.0.0.1", ...localAddresses],
};

export default nextConfig;
