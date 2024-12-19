export const dynamic = "force-static";
import { readFile } from "fs/promises";

export async function GET() {
  const themes = await readFile("themes/index.json", { encoding: "utf-8" });
  if (!themes)
    return Response.json(
      { message: "Themes Not Found", statusCode: 404 },
      { status: 404 }
    );
  return Response.json(JSON.parse(themes));
}
