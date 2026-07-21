export function normalizeWhatsAppPhone(phone?: string | null) {
  if (!phone) return '';

  let digits = phone.replace(/[^\d]/g, '');
  if (!digits) return '';

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  if (digits.startsWith('212')) {
    return digits;
  }

  if (digits.startsWith('0')) {
    return `212${digits.slice(1)}`;
  }

  if (/^[5-7]\d{8}$/.test(digits)) {
    return `212${digits}`;
  }

  return digits.length >= 10 ? digits : '';
}

export function whatsappHref(phone?: string | null) {
  const normalized = normalizeWhatsAppPhone(phone);
  return normalized ? `https://wa.me/${normalized}` : null;
}
