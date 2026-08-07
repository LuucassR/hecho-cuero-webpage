import { getMailer, MAIL_FROM } from "@/lib/email/mailer";
import {
  buildOrderConfirmationEmail,
  type OrderConfirmationEmailData,
} from "@/lib/email/order-confirmation-template";

export async function sendOrderConfirmationEmail(
  order: OrderConfirmationEmailData & { customerEmail: string },
): Promise<void> {
  const { subject, html, text } = buildOrderConfirmationEmail(order);

  await getMailer().sendMail({
    from: MAIL_FROM,
    to: order.customerEmail,
    subject,
    html,
    text,
  });
}
