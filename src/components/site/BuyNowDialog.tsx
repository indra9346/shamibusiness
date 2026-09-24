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
      <button type="button" onClick={() => setOpen(true)} disabled={product.stock === 0} className="flex-1">
        {children}
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-navy">Proceed to checkout?</DialogTitle>
          <DialogDescription>
            You are buying {quantity} × {product.name} for {inr(product.price * quantity)}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={confirm}>
            Continue to Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}