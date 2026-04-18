import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle } from 'lucide-react'
import { useLangStore } from '../store'
import { checkPaymentCallback } from '../utils/payment'

export default function CheckoutSuccessPage() {
  const { lang } = useLangStore()
  const [params] = useSearchParams()
  const [status, setStatus] = useState('success')

  useEffect(() => {
    window.scrollTo(0, 0)
    const cb = checkPaymentCallback()
    if (cb.status && cb.status !== '1' && cb.status !== 'success') {
      setStatus('failed')
    }
  }, [])

  const orderId = params.get('order') || ''

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-[#4c1d95] mb-3 font-serif">
            {lang === 'uz' ? "To'lov amalga oshmadi" : 'Оплата не прошла'}
          </h2>
          <p className="text-gray-500 mb-8">
            {lang === 'uz' ? "To'lovda xatolik yuz berdi. Qayta urinib ko'ring." : 'Произошла ошибка при оплате. Попробуйте ещё раз.'}
          </p>
          <Link to="/checkout" className="inline-block bg-[#ffffff] text-[#4c1d95] font-black px-8 py-3.5 rounded-2xl hover:bg-[#8b5cf6] transition-all">
            {lang === 'uz' ? 'Qayta urinish' : 'Попробовать снова'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-xl border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-[#4c1d95] mb-3 font-serif">
          {lang === 'uz' ? 'Buyurtma qabul qilindi!' : 'Заказ принят!'}
        </h2>
        <p className="text-gray-500 mb-2">
          {lang === 'uz'
            ? "To'lov muvaffaqiyatli amalga oshdi. Tez orada siz bilan bog'lanamiz."
            : 'Оплата прошла успешно. Мы свяжемся с вами в ближайшее время.'}
        </p>
        {orderId && <p className="text-sm text-[#4c1d95] font-bold mb-8">ID: {orderId}</p>}
        <div className="flex gap-3">
          <Link to="/" className="flex-1 bg-[#4c1d95] text-white font-bold py-3.5 rounded-2xl text-center hover:bg-[#4c1d95] transition-colors">
            {lang === 'uz' ? 'Bosh sahifa' : 'На главную'}
          </Link>
          <Link to="/products" className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-2xl text-center hover:bg-gray-200 transition-colors">
            {lang === 'uz' ? 'Xarid davom' : 'Продолжить'}
          </Link>
        </div>
      </div>
    </div>
  )
}
