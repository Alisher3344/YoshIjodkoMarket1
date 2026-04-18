// ============================================================
// To'lov tizimlari integratsiyasi
// Click | Payme | Uzum Bank
// ============================================================

const CLICK_SERVICE_ID   = import.meta.env.VITE_CLICK_SERVICE_ID   || ''
const CLICK_MERCHANT_ID  = import.meta.env.VITE_CLICK_MERCHANT_ID  || ''
const PAYME_MERCHANT_ID  = import.meta.env.VITE_PAYME_MERCHANT_ID  || ''
const UZUM_STORE_ID      = import.meta.env.VITE_UZUM_STORE_ID      || ''

/**
 * Click orqali to'lash
 * Rasmiy hujjat: https://docs.click.uz
 *
 * @param {Object} params
 * @param {string} params.orderId    - Buyurtma ID
 * @param {number} params.amount     - So'mda narx (masalan: 80000)
 * @param {string} params.returnUrl  - To'lovdan keyin qaytish URL
 */
export function payWithClick({ orderId, amount, returnUrl }) {
  if (!CLICK_SERVICE_ID || !CLICK_MERCHANT_ID) {
    alert('Click sozlanmagan. .env faylini tekshiring.')
    return
  }

  // Click to'lov sahifasiga yo'naltirish
  const params = new URLSearchParams({
    service_id:  CLICK_SERVICE_ID,
    merchant_id: CLICK_MERCHANT_ID,
    amount:      amount,            // so'mda
    transaction_param: orderId,
    return_url:  returnUrl || window.location.origin + '/checkout/success',
  })

  window.location.href = `https://my.click.uz/services/pay?${params.toString()}`
}

/**
 * Payme orqali to'lash
 * Rasmiy hujjat: https://developer.payme.uz
 *
 * @param {Object} params
 * @param {string} params.orderId - Buyurtma ID
 * @param {number} params.amount  - TIYIN da narx (so'm * 100)
 * @param {string} params.returnUrl
 */
export function payWithPayme({ orderId, amount, returnUrl }) {
  if (!PAYME_MERCHANT_ID) {
    alert('Payme sozlanmagan. .env faylini tekshiring.')
    return
  }

  // Payme payload yaratish
  const payload = {
    m:  PAYME_MERCHANT_ID,
    ac: { order_id: orderId },
    a:  amount * 100,              // tiyin ga o'tkazish
    c:  returnUrl || window.location.origin + '/checkout/success',
    l:  'uz',
  }

  // Base64 encode
  const encoded = btoa(JSON.stringify(payload))
  window.location.href = `https://checkout.paycom.uz/${encoded}`
}

/**
 * Uzum Bank orqali to'lash
 * Rasmiy hujjat: https://uzumbank.uz/developers
 *
 * @param {Object} params
 * @param {string} params.orderId
 * @param {number} params.amount   - So'mda narx
 * @param {string} params.returnUrl
 */
export function payWithUzum({ orderId, amount, returnUrl }) {
  if (!UZUM_STORE_ID) {
    alert('Uzum Bank sozlanmagan. .env faylini tekshiring.')
    return
  }

  const params = new URLSearchParams({
    store_id:   UZUM_STORE_ID,
    order_id:   orderId,
    amount:     amount,
    return_url: returnUrl || window.location.origin + '/checkout/success',
  })

  window.location.href = `https://checkout.uzumbank.uz/pay?${params.toString()}`
}

/**
 * To'lov usulini tanlash va yo'naltirish
 * @param {string} method - 'click' | 'payme' | 'uzum' | 'cash'
 * @param {Object} orderData - { orderId, total }
 */
export function processPayment(method, { orderId, total }) {
  const returnUrl = `${window.location.origin}/checkout/success?order=${orderId}`

  switch (method) {
    case 'click':
      payWithClick({ orderId, amount: total, returnUrl })
      break
    case 'payme':
      payWithPayme({ orderId, amount: total, returnUrl })
      break
    case 'uzum':
      payWithUzum({ orderId, amount: total, returnUrl })
      break
    case 'cash':
    default:
      // Naqd pul — hech qanday redirect kerak emas
      return true
  }
}

/**
 * To'lov muvaffaqiyatli bo'lganini tekshirish (URL params orqali)
 * Click/Payme/Uzum returnUrl ga sign va status parametr qo'shib qaytadi
 */
export function checkPaymentCallback() {
  const params = new URLSearchParams(window.location.search)
  return {
    orderId: params.get('order') || params.get('order_id'),
    status:  params.get('status') || params.get('pay_status'),
    sign:    params.get('sign'),
  }
}
