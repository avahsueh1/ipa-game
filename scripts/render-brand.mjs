import fs from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";
await fs.mkdir("artifacts", { recursive: true });
for (const name of ["logo", "ribbit-icon"]) {
  const svg = await fs.readFile(`public/${name}.svg`, "utf8");
  const image = new Resvg(svg, {
    background: "#ffffff",
    fitTo: { mode: "width", value: name === "logo" ? 1290 : 384 },
  })
    .render()
    .asPng();
  await fs.writeFile(
    `artifacts/ribbit-${name === "logo" ? "logo" : "icon"}.png`,
    image,
  );
}
