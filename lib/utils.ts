import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidUzbekPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  const uzbekPhoneRegex = /^(90|55|91|93|94|95|97|98|99|88|33|20)\d{7}$/;

  return uzbekPhoneRegex.test(cleaned);
}
