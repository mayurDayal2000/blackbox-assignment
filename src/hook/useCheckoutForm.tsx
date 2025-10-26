import { useState } from "react";

import type { PlanId } from "@/lib/constants";

export interface FormData {
  businessName: string;
  cardNumber: string;
  cvc: string;
  expirationDate: string;
  name: string;
}

export function useCheckoutForm(initialName: string) {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    cardNumber: "",
    cvc: "",
    expirationDate: "",
    name: initialName,
  });

  const [selectedPlan, setSelectedPlan] = useState<PlanId>("monthly");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Form submission complete.");
    setIsSubmitting(false);
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    selectedPlan,
    setSelectedPlan,
  };
}
