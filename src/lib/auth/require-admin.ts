import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "./session";

// Server actions can be invoked from any route, so the /admin proxy check
// alone doesn't protect them. Call this at the top of every admin action.
export async function requireAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token || !(await verifySessionToken(token))) {
    throw new Error("No autorizado");
  }
}
