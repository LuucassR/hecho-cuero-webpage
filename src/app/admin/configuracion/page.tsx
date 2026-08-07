import { db } from "@/db";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await db.query.storeSettings.findFirst();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-brand-900">Configuración</h1>
      <SettingsForm shippingFlatCents={settings?.shippingFlatCents ?? 0} />
    </div>
  );
}
