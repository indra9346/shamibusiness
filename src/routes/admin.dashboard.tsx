import { createFileRoute } from "@tanstack/react-router";
import { Building2, IndianRupee, Package, ShoppingCart, Users, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { DataTable, Filters, Panel, StatCard, StatusBadge } from "@/components/panel/widgets";
import { adminNav } from "@/lib/panel-nav";
import { categorySales, customers, inr, orders, products, salesSeries, vendors } from "@/lib/data";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Control Centre | Shami Business Ventures" },
      { name: "description", content: "Platform-wide revenue, vendors, customers, products and payouts." },
      { property: "og:title", content: "Admin Control Centre | Shami" },
      { property: "og:description", content: "Marketplace analytics and management." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

const pieColors = ["var(--navy)", "var(--gold)", "var(--gold-light)", "var(--slate)"];

function AdminDashboard() {
  return (
    <PanelLayout items={adminNav} tone="admin" title="Control Centre" subtitle="Platform overview · All vendors">
      <Filters options={["Today", "Week", "Month", "Year", "Custom Range"]} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={inr(12480000)} delta="+11%" icon={IndianRupee} highlight />
        <StatCard label="Today's Revenue" value={inr(184200)} delta="+6%" icon={Wallet} />
        <StatCard label="Total Orders" value="3,142" delta="+9%" icon={ShoppingCart} />
        <StatCard label="Pending Orders" value="46" delta="-4%" icon={ShoppingCart} />
        <StatCard label="Total Customers" value={String(customers.length * 268)} delta="+13%" icon={Users} />
        <StatCard label="Total Vendors" value={String(vendors.length * 24)} icon={Building2} />
        <StatCard label="Pending Vendor Approvals" value="1" icon={Building2} highlight />
        <StatCard label="Low Stock Products" value={String(products.filter((p) => p.stock < 30).length)} icon={Package} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Panel title="Revenue Analytics">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesSeries}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--slate)" fontSize={12} />
                <YAxis stroke="var(--slate)" fontSize={12} tickFormatter={(v: number) => `${v / 100000}L`} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Area type="monotone" dataKey="revenue" stroke="var(--gold)" strokeWidth={3} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Category Sales">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySales} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {categorySales.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Customer Growth">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesSeries}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--slate)" fontSize={12} />
                <YAxis stroke="var(--slate)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="customers" fill="var(--navy)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Vendor Performance">
          <DataTable
            columns={["Vendor", "Orders", "Sales", "Commission", "Status"]}
            rows={vendors.map((v) => [
              <span className="font-semibold text-navy">{v.business}</span>,
              v.orders,
              inr(v.sales),
              `${v.commission}%`,
              <StatusBadge status={v.status} />,
            ])}
          />
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Latest Orders">
          <DataTable
            columns={["Order", "Date", "Customer", "Vendor", "Amount", "Payment", "Status"]}
            rows={orders.map((o) => [
              <span className="font-semibold text-navy">{o.id}</span>,
              o.date,
              o.customer,
              o.items[0]!.vendor,
              inr(o.amount),
              <StatusBadge status={o.payment} />,
              <StatusBadge status={o.status} />,
            ])}
          />
        </Panel>
      </div>
    </PanelLayout>
  );
}