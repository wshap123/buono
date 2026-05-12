import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Buono",
    short_name: "Buono",
    description: "Plan your week of meals with Buono.",
    start_url: "/",
    display: "standalone",
    background_color: "#C4622D",
    theme_color: "#C4622D",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
