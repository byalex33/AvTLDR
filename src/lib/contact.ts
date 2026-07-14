export type ContactMessage = {
  name: string
  email: string
  subject: string
  message: string
}

export function validateEmail(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null

  const email = value.trim()
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null
}

export function validateContactMessage(input: Record<keyof ContactMessage, FormDataEntryValue | null>) {
  if (Object.values(input).some((value) => typeof value !== "string")) return null

  const message = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, (value as string).trim()]),
  ) as ContactMessage

  if (
    !message.name ||
    message.name.length > 100 ||
    !validateEmail(message.email) ||
    !message.subject ||
    message.subject.length > 150 ||
    !message.message ||
    message.message.length > 5000
  ) return null

  return message
}
