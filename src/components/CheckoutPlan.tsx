import { Loader2 } from "lucide-react";
import type React from "react";

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

interface CheckoutPlanProps {
  formData: FormData;
  selectedPlan: PlanId;
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onPlanSelect: (planId: PlanId) => void;
}

export function CheckoutPlan({
  formData,
  selectedPlan,
  isSubmitting,
  onInputChange,
  onSubmit,
  onPlanSelect,
}: CheckoutPlanProps) {
  return (
    <Dialog>
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

        <form onSubmit={onSubmit}>
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

              <hr />

              <div className="space-y-4">
                <Label className="font-semibold">Payment method</Label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      onChange={onInputChange}
                      placeholder="0000 0000 0000 0000"
                      required
                      value={formData.cardNumber}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="w-1/2 space-y-2">
                      <Label htmlFor="expirationDate">Expiration Date</Label>
                      <Input
                        id="expirationDate"
                        onChange={onInputChange}
                        placeholder="MM/YY"
                        required
                        value={formData.expirationDate}
                      />
                    </div>
                    <div className="w-1/2 space-y-2">
                      <Label htmlFor="cvc">Security Code</Label>
                      <Input
                        id="cvc"
                        onChange={onInputChange}
                        placeholder="CVC"
                        required
                        value={formData.cvc}
                      />
                    </div>
                  </div>
                </div>
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
                      selectedPlan === plan.id
                        ? "bg-blue-500/10 border-blue-500"
                        : "hover:bg-muted/50"
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
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
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
      </DialogContent>
    </Dialog>
  );
}
