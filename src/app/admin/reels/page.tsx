import { ReelCoverControls } from "@/components/admin/ReelCoverControls";
import { ReelForm } from "@/components/admin/ReelForm";
import { ReelRowActions } from "@/components/admin/ReelRowActions";
import { getInstagramReels } from "@/lib/reels";
import { createReel, deleteReel, moveReel } from "./actions";

export default async function AdminReelsPage() {
  const reels = await getInstagramReels();

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="mb-2 font-display text-2xl text-brand-900">Reels</h1>
        <p className="mb-8 text-sm text-muted">
          Se muestran en la página de inicio en este orden. Si no hay ninguno, la sección se oculta.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="w-10 px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Portada</th>
                <th className="px-4 py-3 font-medium">Link</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {reels.map((reel, i) => (
                <tr key={reel.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted">{i + 1}</td>
                  <td className="px-4 py-3">
                    <ReelCoverControls id={reel.id} coverUrl={reel.coverUrl} />
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all font-medium text-brand-800 hover:underline"
                    >
                      {reel.url.replace("https://www.instagram.com", "")}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <ReelRowActions
                      onMoveUp={i > 0 ? moveReel.bind(null, reel.id, "up") : undefined}
                      onMoveDown={
                        i < reels.length - 1 ? moveReel.bind(null, reel.id, "down") : undefined
                      }
                      onDelete={deleteReel.bind(null, reel.id)}
                    />
                  </td>
                </tr>
              ))}
              {reels.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">
                    Todavía no hay reels.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-display text-lg text-brand-900">Nuevo reel</h2>
        <ReelForm action={createReel} />
      </div>
    </div>
  );
}
