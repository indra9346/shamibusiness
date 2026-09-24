import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { inr, type Product } from "@/lib/data";

export function BuyNowDialog({ product, quantity = 1, onConfirm, children }: {
  product: Product;
  quantity?: number;
  onConfirm: () => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const confirm = () => {
    setOpen(false);
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button type="button" onClick={() => setOpen(true)} disabled={product.stock === 0} className="flex-1 cursor-pointer disabled:cursor-not-allowed">
        {children}
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-navy">Buy this product</DialogTitle>
          <DialogDescription>Review the selected product before continuing to checkout.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 rounded-lg border border-border bg-ivory p-3">
          <img src={product.image} alt={product.name} width={96} height={96} className="h-20 w-20 rounded-md object-cover" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-navy">{product.name}</p>
            <p className="mt-1 text-xs text-slate">{product.vendor} · Qty {quantity}</p>
            <p className="mt-2 font-bold text-navy">{inr(product.price * quantity)}</p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={confirm}>
            Buy Now & Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}