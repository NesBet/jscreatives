"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface PayNowButtonProps {
  orderId: string;
  reference: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PayNowButton({ orderId, reference, className, size = "md" }: PayNowButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    setPaying(true);
    try {
      const initRes = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!initRes.ok) {
        const data = await initRes.json();
        throw new Error(data.error || "Could not start payment");
      }

      const { accessCode } = await initRes.json();

      const PaystackPop = (await import("@paystack/inline-js")).default;
      const popup = new PaystackPop();
      popup.resumeTransaction(accessCode, {
        onSuccess: () => {
          router.push(`/orders/${orderId}?ref=${reference}`);
        },
        onCancel: () => {
          setPaying(false);
          toast("info", "Payment cancelled — your order is still saved");
        },
        onError: () => {
          setPaying(false);
          toast("error", "Payment failed. Please try again.");
        },
      });
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Something went wrong");
      setPaying(false);
    }
  };

  return (
    <Button onClick={handlePay} loading={paying} size={size} className={className}>
      {paying ? "Opening Paystack..." : "Pay Now"}
    </Button>
  );
}
