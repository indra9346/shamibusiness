import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Boxes, IndianRupee, PackageCheck, PackageX, TriangleAlert } from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { DataTable, Panel, StatCard, StatusBadge } from "@/components/panel/widgets";
import { adminNav } from "@/lib/panel-nav";
import { inr } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory | Shami Business Ventures Admin" },
      { name: "description", content: "Track stock levels, reserved inventory and reorder alerts." },
      { property: "og:title", content: "Inventory | Shami Admin" },
      { property: "og:description", content: "Platform-wide stock overview." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminInventory,
});

const REORDER = 30;
const PAGE_SIZE = 10;

function stockStatus(stock: number) {
  if (stock <= 0) return "Out of Stock";
  if (stock < REORDER) return "Low Stock";
  return "In Stock";
}

function AdminInventory() {
  const { products, updateProduct } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("stock-asc");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<string | null>(null);
  const [newStock, setNewStock] = useState("");

  const stats = useMemo(() => {
    const inStock = products.filter((p) => stockStatus(p.stock) === "In Stock").length;
    const low = products.filter((p) => stockStatus(p.stock) === "Low Stock").length;
    const out = products.filter((p) => stockStatus(p.stock) === "Out of Stock").length;
    const value = products.reduce((s, p) => s + p.stock * p.price, 0);
    return { total: products.length, inStock, low, out, value };
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "All" || stockStatus(p.stock) === filter;
      return matchSearch && matchFilter;
    });
    list = [...list].sort((a, b) => {
      if (sort === "stock-asc") return a.stock - b.stock;
      if (sort === "stock-desc") return b.stock - a.stock;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [products, search, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const targetProduct = products.find((p) => p.id === target);

  const openUpdate = (id: string, stock: number) => {
    setTarget(id);
    setNewStock(String(stock));
  };

  const saveStock = () => {
    const val = Number(newStock);
    if (!targetProduct || Number.isNaN(val) || val < 0) {
      toast.error("Enter a valid stock quantity");
      return;
    }
    updateProduct(targetProduct.id, { stock: val });
    toast.success(`Stock for ${targetProduct.name} updated to ${val} units`);
    setTarget(null);
  };

  return (
    <PanelLayout items={adminNav} tone="admin" title="Inventory" subtitle="Stock overview across all vendors">
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total SKUs" value={String(stats.total)} icon={Boxes} />
        <StatCard label="In Stock" value={String(stats.inStock)} icon={PackageCheck} />
        <StatCard label="Low Stock" value={String(stats.low)} icon={TriangleAlert} highlight />
        <StatCard label="Out of Stock" value={String(stats.out)} icon={PackageX} />
        <StatCard label="Stock Value" value={inr(stats.value)} icon={IndianRupee} />
      </div>

      <Panel
        title="Product Stock"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search by name or SKU"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-9 w-56"
            />
            <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }}>
              <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="stock-asc">Stock: Low to High</SelectItem>
                <SelectItem value="stock-desc">Stock: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        <DataTable
          columns={["Product", "SKU", "Stock", "Reserved", "Available", "Reorder Level", "Status", "Action"]}
          rows={pageItems.map((p) => [
            <span className="font-semibold text-navy">{p.name}</span>,
            <span className="text-xs text-slate">{p.sku}</span>,
            p.stock,
            p.reserved,
            Math.max(0, p.stock - p.reserved),
            REORDER,
            <StatusBadge status={stockStatus(p.stock)} />,
            <Button size="sm" variant="outline" onClick={() => openUpdate(p.id, p.stock)}>Update Stock</Button>,
          ])}
        />
        <div className="mt-4 flex items-center justify-between text-xs text-slate">
          <span>Page {page} of {totalPages} · {filtered.length} products</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </Panel>

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock — {targetProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-1.5 py-2">
            <Label>New Stock Quantity</Label>
            <Input type="number" min={0} value={newStock} onChange={(e) => setNewStock(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>Cancel</Button>
            <Button className="bg-navy text-white hover:bg-navy/90" onClick={saveStock}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PanelLayout>
  );
}
