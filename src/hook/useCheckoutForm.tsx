import { useEffect, useState } from "react";
import type { PlanId } from "@/lib/constants";

export interface FormData {
  businessName: string;
  name: string;
}

export function useCheckoutForm(initialName: string) {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    name: initialName,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, name: initialName || "" }));
  }, [initialName]);

  const [selectedPlan, setSelectedPlan] = useState<PlanId>("monthly");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return {
    formData,
    handleInputChange,
    selectedPlan,
    setSelectedPlan,
  };
}
