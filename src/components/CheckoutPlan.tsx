import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData } from "@/hook/useCheckoutForm";
import { PLANS, type PlanId } from "@/lib/constants";
import { cn } from "@/lib/utils";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

interface CheckoutPlanProps {
  formData: FormData;
  selectedPlan: PlanId;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlanSelect: (planId: PlanId) => void;
  user: { email: string; uid: string };
}

export function CheckoutPlan({
  formData,
  selectedPlan,
  onInputChange,
  onPlanSelect,
  user,
}: CheckoutPlanProps) {
  const [open, setOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [secretLoading, setSecretLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSecretLoading(true);
    (async () => {
      try {
        const res = await fetch("/api/stripe/create-checkout-session/", {
          body: JSON.stringify({
            plan: selectedPlan,
            userEmail: user.email,
            userId: user.uid,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        const data = await res.json();
        console.log(data);
        setClientSecret(data.clientSecret ?? null);
      } catch {
        setClientSecret(null);
      } finally {
        setSecretLoading(false);
      }
    })();
  }, [open, selectedPlan, user]);

  const elementsOptions = useMemo(() => {
    return clientSecret ? { clientSecret } : undefined;
  }, [clientSecret]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="secondary">Upgrade Plan</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upgrade to the Plus plan</DialogTitle>
          <DialogDescription>
            Do more with unlimited charts, files, automations & integrations.
          </DialogDescription>
        </DialogHeader>

        {!elementsOptions ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            {secretLoading ? "Loading payment..." : "Unable to initialize payment. Try again."}
          </div>
        ) : (
          <Elements options={elementsOptions} stripe={stripePromise}>
            <CheckoutForm
              clientSecret={clientSecret as string}
              formData={formData}
              onInputChange={onInputChange}
              onPlanSelect={onPlanSelect}
              onSuccess={() => setOpen(false)}
              selectedPlan={selectedPlan}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CheckoutForm(props: {
  clientSecret: string;
  formData: FormData;
  selectedPlan: PlanId;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlanSelect: (planId: PlanId) => void;
  onSuccess: () => void;
}) {
  const { clientSecret, formData, selectedPlan, onInputChange, onPlanSelect, onSuccess } = props;

  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    // Validate the PaymentElement fields (wallets, etc.)
    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast.error(submitError.message ?? "Please check your payment details");
      setIsProcessing(false);
      return;
    }

    const result = await stripe.confirmPayment({
      clientSecret,
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      toast.error(result.error.message ?? "Payment failed");
      setIsProcessing(false);
      return;
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
    switch (paymentIntent?.status) {
      case "succeeded":
        toast.success("Payment successful");
        onSuccess();
        break;
      case "processing":
        toast.info("Payment pending, processing…");
        break;
      default:
        toast.error("Payment failed, try another method");
    }

    setIsProcessing(false);
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {/* Left Column: User and Payment Info */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                onChange={onInputChange}
                placeholder="Robert"
                required
                type="text"
                value={formData.name}
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="businessName">Business name (optional)</Label>
              <Input
                id="businessName"
                onChange={onInputChange}
                placeholder="Blackbox"
                type="text"
                value={formData.businessName}
              />
            </div>
          </div>

          <div className="max-h-[60vh] overflow-auto">
            <PaymentElement id="payment-element" />
          </div>
        </div>

        {/* Right Column: Billing Options */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Billing options</h2>
            {Object.values(PLANS).map((plan) => (
              <button
                className={cn(
                  "flex items-center p-3 rounded-lg border cursor-pointer w-full transition-colors",
                  selectedPlan === plan.id ? "bg-blue-500/10 border-blue-500" : "hover:bg-muted/50"
                )}
                key={plan.id}
                onClick={() => onPlanSelect(plan.id)}
                type="button"
              >
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0">
                  {selectedPlan === plan.id && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex-grow text-start">
                  <p className="font-semibold">{plan.name}</p>
                  <p className="text-sm text-muted-foreground">{plan.priceText}</p>
                </div>
              </button>
            ))}
          </div>

          <hr />

          <div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base py-6"
              disabled={isProcessing || !stripe || !elements}
              type="submit"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Upgrading...
                </>
              ) : (
                `Upgrade to Plus ($${PLANS[selectedPlan].price}/mo)`
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
