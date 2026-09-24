import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, IndianRupee, Receipt } from "lucide-react";
import { toast } from "sonner";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { DataTable, Panel, StatCard, StatusBadge } from "@/components/panel/widgets";
import { accountNav } from "@/lib/account-nav";
import { inr } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account/invoices")({
  head: () => ({
    meta: [
      { title: "Invoices | Shami Business Ventures" },
      { name: "description", content: "Download GST invoices for every order placed on Shami Business Ventures." },
      { property: "og:title", content: "My Invoices | Shami" },
      { property: "og:description", content: "GST-compliant invoices for all your orders." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountInvoices,
});

function AccountInvoices() {
  const { user, orders } = useApp();
  const mine = user ? orders.filter((o) => o.email === user.email) : [];
  const list = mine.length ? mine : orders.slice(0, 12);
  const total = list.reduce((s, o) => s + o.amount, 0);
  const gst = list.reduce((s, o) => s + o.tax, 0);

  return (
    <PanelLayout items={accountNav} tone="customer" title="Invoices" subtitle="GST invoices for your orders">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Invoices" value={String(list.length)} icon={FileText} highlight />
        <StatCard label="Invoiced Value" value={inr(total)} icon={IndianRupee} />
        <StatCard label="GST Paid" value={inr(gst)} icon={Receipt} />
      </div>

      <Panel title="Invoice History" className="mt-6">
        <DataTable
          columns={["Invoice No", "Order", "Date", "Amount", "GST", "Payment", "Actions"]}
          rows={list.map((o) => [
            <span className="font-semibold text-navy">INV-{o.id.replace(/[^0-9]/g, "")}</span>,
            <Link to="/account/orders/$id" params={{ id: o.id }} className="font-semibold text-navy hover:text-gold">
              {o.id}
            </Link>,
            o.date,
            inr(o.amount),
            inr(o.tax),
            <StatusBadge status={o.payment} />,
            <Button variant="outline" size="sm" onClick={() => toast.success(`Invoice for ${o.id} downloaded`)}>
              Download
            </Button>,
          ])}
        />
      </Panel>
    </PanelLayout>
  );
}