import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, MessageSquare, Plug, RefreshCw, Truck } from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { Panel, StatCard, StatusBadge } from "@/components/panel/widgets";
import { adminNav } from "@/lib/panel-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations | Shami Business Ventures Admin" },
      { name: "description", content: "Payment gateways, logistics partners, messaging and accounting integrations." },
      { property: "og:title", content: "Integrations | Shami Admin" },
      { property: "og:description", content: "Connect payment, logistics and messaging providers." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminIntegrations,
});

type Integration = {
  key: string;
  name: string;
  category: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  fields: { label: string; value: string; secret?: boolean }[];
};

const seed: Integration[] = [
  {
    key: "razorpay", name: "Razorpay", category: "Payments", desc: "UPI, cards, net banking and 30/70 split collections", icon: CreditCard, enabled: true,
    fields: [{ label: "Key ID", value: "rzp_live_S8H2••••" }, { label: "Key Secret", value: "••••••••••••", secret: true }],
  },
  {
    key: "phonepe", name: "PhonePe Business", category: "Payments", desc: "UPI intent and QR collections for bulk buyers", icon: CreditCard, enabled: true,
    fields: [{ label: "Merchant ID", value: "SHAMIBIZ01" }, { label: "Salt Key", value: "••••••••••••", secret: true }],
  },
  {
    key: "delhivery", name: "Delhivery Freight", category: "Logistics", desc: "Pan-India LTL freight with AWB tracking", icon: Truck, enabled: true,
    fields: [{ label: "Client Name", value: "SHAMI-BLR" }, { label: "API Token", value: "••••••••••••", secret: true }],
  },
  {
    key: "shiprocket", name: "Shiprocket", category: "Logistics", desc: "Retail parcel shipping and label printing", icon: Truck, enabled: false,
    fields: [{ label: "Email", value: "ops@shamiventures.in" }, { label: "Password", value: "••••••••••••", secret: true }],
  },
  {
    key: "msg91", name: "MSG91 SMS", category: "Messaging", desc: "Transactional SMS for dispatch and OTP alerts", icon: MessageSquare, enabled: true,
    fields: [{ label: "Sender ID", value: "SHAMIB" }, { label: "Auth Key", value: "••••••••••••", secret: true }],
  },
  {
    key: "whatsapp", name: "WhatsApp Cloud API", category: "Messaging", desc: "Order tracking and invoice delivery on WhatsApp", icon: MessageSquare, enabled: false,
    fields: [{ label: "Phone Number ID", value: "10938472019" }, { label: "Access Token", value: "••••••••••••", secret: true }],
  },
  {
    key: "tally", name: "Tally / GST Sync", category: "Accounting", desc: "Push GST invoices and e-way bills to Tally", icon: Plug, enabled: true,
    fields: [{ label: "Company", value: "Shami Business Ventures" }, { label: "Sync Token", value: "••••••••••••", secret: true }],
  },
  {
    key: "ga4", name: "Google Analytics 4", category: "Analytics", desc: "Storefront traffic and conversion tracking", icon: Plug, enabled: true,
    fields: [{ label: "Measurement ID", value: "G-SHAMI2026" }],
  },
];

function AdminIntegrations() {
  const [items, setItems] = useState(seed);
  const [filter, setFilter] = useState("All");

  const categories = useMemo(() => ["All", ...new Set(seed.map((i) => i.category))], []);
  const list = useMemo(() => items.filter((i) => filter === "All" || i.category === filter), [items, filter]);
  const connected = items.filter((i) => i.enabled).length;

  const toggle = (key: string) => {
    setItems((l) => l.map((i) => (i.key === key ? { ...i, enabled: !i.enabled } : i)));
    const item = items.find((i) => i.key === key);
    toast.success(`${item?.name} ${item?.enabled ? "disconnected" : "connected"}`);
  };

  return (
    <PanelLayout items={adminNav} tone="admin" title="Integrations" subtitle="Payments, logistics, messaging and accounting">
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Available Integrations" value={String(items.length)} icon={Plug} />
        <StatCard label="Connected" value={String(connected)} icon={CheckCircle2} highlight />
        <StatCard label="Payment Gateways" value={String(items.filter((i) => i.category === "Payments" && i.enabled).length)} icon={CreditCard} />
        <StatCard label="Logistics Partners" value={String(items.filter((i) => i.category === "Logistics" && i.enabled).length)} icon={Truck} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filter === c ? "border-navy bg-navy text-white" : "border-border bg-card text-slate hover:border-gold hover:text-gold"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {list.map((i) => (
          <Panel
            key={i.key}
            title={i.name}
            action={<StatusBadge status={i.enabled ? "Active" : "Pending"} />}
          >
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy/5 text-navy">
                  <i.icon className="h-5 w-5" />
                </span>
                <div>
                  <Badge variant="outline" className="mb-1 text-[10px]">{i.category}</Badge>
                  <p className="text-sm text-charcoal">{i.desc}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {i.fields.map((f) => (
                  <div key={f.label} className="grid gap-1.5">
                    <Label className="text-xs">{f.label}</Label>
                    <Input defaultValue={f.value} type={f.secret ? "password" : "text"} readOnly={!i.enabled} />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <Switch checked={i.enabled} onCheckedChange={() => toggle(i.key)} />
                  <span className="text-xs font-semibold text-slate">{i.enabled ? "Connected" : "Disconnected"}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast.success(`${i.name} credentials saved`)}>Save</Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      i.enabled ? toast.success(`${i.name} connection test passed`) : toast.error(`${i.name} is disconnected`)
                    }
                  >
                    <RefreshCw className="mr-1 h-3.5 w-3.5" /> Test
                  </Button>
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </PanelLayout>
  );
}
