import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Globe, Image as ImageIcon, LayoutTemplate, Megaphone, Save } from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { DataTable, Panel, StatCard, StatusBadge } from "@/components/panel/widgets";
import { adminNav } from "@/lib/panel-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import hero from "@/assets/hero-sugar.jpg";
import pSugar from "@/assets/p-sugar.jpg";
import pRice from "@/assets/p-rice.jpg";
import pOil from "@/assets/p-oil.jpg";
import pDal from "@/assets/p-dal.jpg";

export const Route = createFileRoute("/admin/website")({
  head: () => ({
    meta: [
      { title: "Website CMS | Shami Business Ventures Admin" },
      { name: "description", content: "Manage homepage banners, page content, banners and SEO for the Shami storefront." },
      { property: "og:title", content: "Website CMS | Shami Admin" },
      { property: "og:description", content: "Storefront content management." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminWebsite,
});

const initialPages = [
  { slug: "/", title: "Homepage", updated: "22 Aug 2026", status: "Published" },
  { slug: "/about", title: "About Shami Business Ventures", updated: "18 Aug 2026", status: "Published" },
  { slug: "/contact", title: "Contact & Enquiries", updated: "12 Aug 2026", status: "Published" },
  { slug: "/categories", title: "Category Directory", updated: "09 Aug 2026", status: "Published" },
  { slug: "/policies/refund", title: "Refund & Return Policy", updated: "02 Aug 2026", status: "Draft" },
];

function AdminWebsite() {
  const [hero1, setHero1] = useState({
    heading: "Premium Sugar & Staples, Sourced Direct From Verified Mills",
    sub: "Institutional-grade sugar, rice, edible oils and pulses with GST invoicing and pan-India freight.",
    cta: "Shop Bulk Catalogue",
  });
  const [announcement, setAnnouncement] = useState("Free freight on bulk orders above ₹5,000 · GST invoice on every order");
  const [announcementOn, setAnnouncementOn] = useState(true);
  const [seo, setSeo] = useState({
    title: "Shami Business Ventures — Bulk Sugar, Rice, Oils & Pulses",
    description: "Buy institutional-grade sugar, rice, edible oils and pulses from verified Indian vendors with GST invoicing.",
    keywords: "bulk sugar supplier, wholesale rice, edible oil distributor, pulses wholesale India",
  });
  const [banners, setBanners] = useState([
    { id: 1, name: "Homepage Hero", image: hero, placement: "Home / Hero", status: "Published", on: true },
    { id: 2, name: "Sugar Festive Offer", image: pSugar, placement: "Home / Strip", status: "Published", on: true },
    { id: 3, name: "Rice Harvest Sale", image: pRice, placement: "Shop / Top", status: "Draft", on: false },
    { id: 4, name: "Edible Oil Combo", image: pOil, placement: "Offers / Grid", status: "Published", on: true },
    { id: 5, name: "Pulses Wholesale", image: pDal, placement: "Category / Banner", status: "Draft", on: false },
  ]);
  const [pages, setPages] = useState(initialPages);

  const toggleBanner = (id: number) => {
    setBanners((b) => b.map((x) => (x.id === id ? { ...x, on: !x.on, status: !x.on ? "Published" : "Draft" } : x)));
    toast.success("Banner visibility updated");
  };

  const togglePage = (slug: string) => {
    setPages((p) =>
      p.map((x) => (x.slug === slug ? { ...x, status: x.status === "Published" ? "Draft" : "Published" } : x)),
    );
    toast.success(`Page ${slug} status updated`);
  };

  return (
    <PanelLayout items={adminNav} tone="admin" title="Website CMS" subtitle="Storefront content, banners and SEO">
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Published Pages" value={String(pages.filter((p) => p.status === "Published").length)} icon={LayoutTemplate} highlight />
        <StatCard label="Draft Pages" value={String(pages.filter((p) => p.status === "Draft").length)} icon={LayoutTemplate} />
        <StatCard label="Active Banners" value={String(banners.filter((b) => b.on).length)} icon={ImageIcon} />
        <StatCard label="Announcement Bar" value={announcementOn ? "Live" : "Off"} icon={Megaphone} />
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="hero">Hero & Announcement</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Homepage Hero">
              <div className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label>Heading</Label>
                  <Input value={hero1.heading} onChange={(e) => setHero1((h) => ({ ...h, heading: e.target.value }))} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Sub-heading</Label>
                  <Textarea rows={3} value={hero1.sub} onChange={(e) => setHero1((h) => ({ ...h, sub: e.target.value }))} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Primary CTA label</Label>
                  <Input value={hero1.cta} onChange={(e) => setHero1((h) => ({ ...h, cta: e.target.value }))} />
                </div>
                <Button className="bg-navy text-white hover:bg-navy/90 sm:w-fit" onClick={() => toast.success("Hero section saved")}>
                  <Save className="mr-1 h-4 w-4" /> Save Hero
                </Button>
              </div>
            </Panel>

            <div className="grid gap-6 content-start">
              <Panel title="Live Preview">
                <div className="overflow-hidden rounded-lg border border-border">
                  <div className="relative">
                    <img src={hero} alt="Homepage hero preview" className="h-40 w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-navy/70 p-4">
                      <p className="line-clamp-2 text-sm font-bold text-white">{hero1.heading}</p>
                      <p className="mt-1 line-clamp-2 text-[11px] text-white/80">{hero1.sub}</p>
                      <span className="mt-2 inline-block rounded bg-gold px-3 py-1 text-[11px] font-semibold text-midnight">{hero1.cta}</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel title="Announcement Bar">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
                    <span className="text-sm font-semibold text-navy">Show announcement bar</span>
                    <Switch
                      checked={announcementOn}
                      onCheckedChange={(v) => {
                        setAnnouncementOn(v);
                        toast.success(v ? "Announcement bar enabled" : "Announcement bar hidden");
                      }}
                    />
                  </div>
                  <Textarea rows={2} value={announcement} onChange={(e) => setAnnouncement(e.target.value)} />
                  <Button className="bg-navy text-white hover:bg-navy/90 sm:w-fit" onClick={() => toast.success("Announcement saved")}>
                    <Save className="mr-1 h-4 w-4" /> Save
                  </Button>
                </div>
              </Panel>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="banners">
          <Panel title="Banner Library" action={<Button variant="outline" size="sm" onClick={() => toast.success("Upload dialog is available to brand managers")}>Upload Banner</Button>}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {banners.map((b) => (
                <div key={b.id} className="overflow-hidden rounded-lg border border-border bg-card">
                  <img src={b.image} alt={b.name} className="h-36 w-full object-cover" loading="lazy" />
                  <div className="grid gap-2 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-navy">{b.name}</p>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-xs text-slate">{b.placement}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-slate">Visible</span>
                      <Switch checked={b.on} onCheckedChange={() => toggleBanner(b.id)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="pages">
          <Panel title="Static Pages">
            <DataTable
              columns={["Page", "Slug", "Last Updated", "Status", "Action"]}
              rows={pages.map((p) => [
                <span className="font-semibold text-navy">{p.title}</span>,
                <span className="text-xs text-slate">{p.slug}</span>,
                p.updated,
                <StatusBadge status={p.status} />,
                <Button variant="outline" size="sm" onClick={() => togglePage(p.slug)}>
                  {p.status === "Published" ? "Unpublish" : "Publish"}
                </Button>,
              ])}
            />
          </Panel>
        </TabsContent>

        <TabsContent value="seo">
          <Panel title="Global SEO Defaults">
            <div className="grid gap-4 xl:max-w-3xl">
              <div className="grid gap-1.5">
                <Label>Meta title</Label>
                <Input value={seo.title} onChange={(e) => setSeo((s) => ({ ...s, title: e.target.value }))} />
                <p className="text-xs text-slate">{seo.title.length}/60 characters</p>
              </div>
              <div className="grid gap-1.5">
                <Label>Meta description</Label>
                <Textarea rows={3} value={seo.description} onChange={(e) => setSeo((s) => ({ ...s, description: e.target.value }))} />
                <p className="text-xs text-slate">{seo.description.length}/160 characters</p>
              </div>
              <div className="grid gap-1.5">
                <Label>Focus keywords</Label>
                <Input value={seo.keywords} onChange={(e) => setSeo((s) => ({ ...s, keywords: e.target.value }))} />
              </div>
              <Button className="bg-navy text-white hover:bg-navy/90 sm:w-fit" onClick={() => toast.success("SEO defaults saved")}>
                <Globe className="mr-1 h-4 w-4" /> Save SEO Settings
              </Button>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </PanelLayout>
  );
}
