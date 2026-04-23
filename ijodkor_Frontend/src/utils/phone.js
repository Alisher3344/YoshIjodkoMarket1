// O'zbek raqamiga +998 XX XXX XX XX maska beradi.
// Foydalanuvchi nima yozsa ham faqat raqamlarni qoldiradi va formatlaydi.
export function formatPhone(value) {
  let digits = (value || "").replace(/\D/g, "");

  if (!digits.startsWith("998")) {
    if (digits.startsWith("0")) digits = digits.slice(1);
    digits = "998" + digits;
  }

  digits = digits.slice(0, 12);

  let formatted = "+998";
  if (digits.length > 3) formatted += " " + digits.slice(3, 5);
  if (digits.length > 5) formatted += " " + digits.slice(5, 8);
  if (digits.length > 8) formatted += " " + digits.slice(8, 10);
  if (digits.length > 10) formatted += " " + digits.slice(10, 12);

  return formatted;
}

export function isValidPhone(value) {
  return (value || "").replace(/\D/g, "").length === 12;
}
