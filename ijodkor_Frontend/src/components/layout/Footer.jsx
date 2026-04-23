import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/useStore";

export default function Footer() {
  const { t, lang } = useStore();
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo-footer.png"
                alt="Yoshijodkor"
                className="w-10 h-10 object-contain"
              />
              <div>
                <div className="text-white font-black text-xl">Yoshijodkor</div>
                <div className="text-gray-400 text-xs">.uz</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {t("footerDesc")}
            </p>
            <div className="flex gap-3 mt-4">
              {["📘", "📷", "▶️", "✉️"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-[#1a56db] rounded-lg flex items-center justify-center text-base transition"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: t("home"), path: "/" },
                { label: t("catalog"), path: "/catalog" },
                { label: t("about"), path: "/about" },
                { label: t("contact"), path: "/contact" },
                { label: t("adminPanel"), path: "/admin" },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1.5"
                  >
                    <span className="text-[#f97316]">›</span> {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              {t("contact")}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin
                  size={15}
                  className="text-[#f97316] flex-shrink-0 mt-0.5"
                />
                <span>
                  Qashqadaryo viloyati, Qarshi shahri, I.Karimov ko'chasi,
                  276-uy
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={15} className="text-[#f97316]" />
                <a
                  href="tel:+998987770727"
                  className="hover:text-white transition"
                >
                  +998 98 777 07 27
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail size={15} className="text-[#f97316]" />
                <a
                  href="mailto:info@yoshijodkor.uz"
                  className="hover:text-white transition"
                >
                  info@yoshijodkor.uz
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Send
                  size={15}
                  className="text-[#f97316] flex-shrink-0 mt-0.5"
                />
                <span>Qashqadaryo viloyati Xalq ta'limi boshqarmasi</span>
              </li>
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              {t("paymentMethods")}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Click", color: "bg-blue-600" },
                { name: "Payme", color: "bg-blue-500" },
                { name: "Uzum", color: "bg-purple-600" },
                { name: "Visa", color: "bg-blue-700" },
                { name: "Mastercard", color: "bg-red-600" },
                { name: "Naqd", color: "bg-green-600" },
              ].map((p) => (
                <div
                  key={p.name}
                  className={`${p.color} text-white text-xs font-bold text-center py-2 px-3 rounded-lg`}
                >
                  {p.name}
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-800 rounded-xl p-3">
              <p className="text-xs text-gray-400 leading-relaxed">
                {lang === "uz"
                  ? "Barcha to'lovlar xavfsiz va shifrlangan tizim orqali amalga oshiriladi."
                  : "Все платежи проводятся через безопасную зашифрованную систему."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <span>
            © {new Date().getFullYear()} Yoshijodkor.uz. {t("rights")}.
          </span>
          <span className="flex items-center gap-1">
            Made with ❤️ for Uzbekistan
          </span>
        </div>
      </div>
    </footer>
  );
}
