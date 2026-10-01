import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { INCOMING_FOLDER } from "@/lib/blob-access";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const isValid = token ? await verifySessionToken(token) : false;
        if (!isValid) {
          throw new Error("No autorizado");
        }
        // Originals only land in the incoming folder; the server converts them
        // to WebP and deletes them (see optimizeUploadedImage).
        if (!pathname.startsWith(`${INCOMING_FOLDER}/`)) {
          throw new Error("Ruta de subida inválida");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
          maximumSizeInBytes: 25 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // No-op: the client hands the URL to attachProductImage / setReelCover.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al subir la imagen" },
      { status: 400 },
    );
  }
}
