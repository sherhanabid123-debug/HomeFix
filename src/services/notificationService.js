// ==========================================================================
// HomeFix Kerala - Instant SMS & WhatsApp Notification Service
// ==========================================================================

/**
 * Format and trigger direct WhatsApp notification link for Kerala homeowners
 */
export function generateWhatsAppLink({ bookingId, service, district, address, landmark, phone, slot }) {
  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '919447000000';
  const targetPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  
  const text = encodeURIComponent(
    `🏠 *HomeFix Kerala Booking Confirmation*\n\n` +
    `📌 *Booking ID:* ${bookingId}\n` +
    `⚡ *Service:* ${service}\n` +
    `📍 *Location:* ${address}${landmark ? ` (Landmark: ${landmark})` : ''}, ${district}\n` +
    `⏰ *Slot:* ${slot}\n` +
    `💳 *Payment:* Pay after service (UPI / Cash)\n\n` +
    `Technician is being assigned to your doorstep. Reply *TRACK* for live location.`
  );

  return `https://wa.me/${targetPhone}?text=${text}`;
}

/**
 * API Webhook handler for Twilio / WhatsApp Cloud API Integration
 */
export async function sendInstantBookingSMS({ bookingId, service, phone, slot }) {
  console.log(`[SMS Gateway Integration] Sending SMS to ${phone} for Booking ${bookingId}...`);
  
  // Simulated API response for SMS gateway (e.g. Fast2SMS / DLT Kerala Gateway / Twilio)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        messageId: `SMS-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'DELIVERED',
        gateway: 'BSNL DLT Kerala SMS Gateway'
      });
    }, 600);
  });
}
