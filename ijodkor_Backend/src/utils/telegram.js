// ============================================================
// Telegram Bot Notification Service
// Sozlash: .env faylga BOT_TOKEN va CHAT_ID qo'shing
// ============================================================

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID   = import.meta.env.VITE_TELEGRAM_CHAT_ID   || ''

/**
 * Telegramga xabar yuborish
 * @param {string} message - HTML formatdagi xabar
 */
async function sendTelegramMessage(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram bot sozlanmagan. .env faylni tekshiring.')
    return false
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )
    const data = await res.json()
    return data.ok
  } catch (err) {
    console.error('Telegram xabar yuborishda xato:', err)
    return false
  }
}

/**
 * Yangi buyurtma haqida xabar yuborish
 * @param {Object} order - buyurtma obyekti
 */
export async function notifyNewOrder(order) {
  const items = order.items
    ?.map(i => `  • <b>${i.name_uz}</b> × ${i.qty} = ${(i.price * i.qty).toLocaleString('uz-UZ')} so'm`)
    .join('\n') || ''

  const paymentLabels = {
    cash:  '💵 Naqd pul',
    click: '🟢 Click',
    payme: '🔵 Payme',
    uzum:  '🟣 Uzum Bank',
  }

  const message = `
🛒 <b>YANGI BUYURTMA!</b>

🆔 <code>${order.id}</code>
📅 ${new Date(order.createdAt).toLocaleString('uz-UZ')}

👤 <b>Mijoz:</b> ${order.name}
📞 <b>Telefon:</b> <a href="tel:${order.phone}">${order.phone}</a>
📍 <b>Manzil:</b> ${order.address}
💳 <b>To'lov:</b> ${paymentLabels[order.payment] || order.payment}

📦 <b>Mahsulotlar:</b>
${items}

💰 <b>Jami: ${order.total.toLocaleString('uz-UZ')} so'm</b>

<a href="https://yoshijodkor.uz/admin/dashboard">Admin panelga kirish →</a>
`.trim()

  return sendTelegramMessage(message)
}

/**
 * Buyurtma holati o'zgarganda xabar yuborish
 * @param {string} orderId
 * @param {string} newStatus
 * @param {string} customerName
 */
export async function notifyStatusChange(orderId, newStatus, customerName) {
  const statusEmoji = {
    new:       '🔵 Yangi',
    processing:'🟡 Jarayonda',
    done:      '🟢 Bajarildi',
    cancelled: '🔴 Bekor qilindi',
  }

  const message = `
📦 <b>Buyurtma holati o'zgardi</b>

🆔 <code>${orderId}</code>
👤 <b>Mijoz:</b> ${customerName}
📊 <b>Yangi holat:</b> ${statusEmoji[newStatus] || newStatus}
`.trim()

  return sendTelegramMessage(message)
}
