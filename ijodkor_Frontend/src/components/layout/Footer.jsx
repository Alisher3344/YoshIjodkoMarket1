import { Link } from "react-router-dom";
import useStore from "../../store/useStore";

export default function Footer() {
  const { t, lang } = useStore();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo va tavsif */}
          <div>
            <div className="flex items-center gap-2 font-black text-xl mb-3">
              🎨 <span>Yoshijodkor</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t("footerDesc")}
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://t.me/yoshijodkor"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#1a56db] rounded-xl flex items-center justify-center hover:bg-[#1341a8] transition text-sm font-bold"
              >
                TG
              </a>
              <a
                href="https://instagram.com/yoshijodkor"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-pink-600 rounded-xl flex items-center justify-center hover:bg-pink-700 transition text-sm font-bold"
              >
                IG
              </a>
            </div>
          </div>

          {/* Havolalar */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/", label: t("home") },
                { to: "/catalog", label: t("catalog") },
                {
                  to: "/custom-order",
                  label: lang === "uz" ? "Buyurtma berish" : "Спецзаказ",
                },
                { to: "/about", label: t("about") },
                { to: "/contact", label: t("contact") },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-gray-400 hover:text-white text-sm transition"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aloqa */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">
              {t("contact")}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📞 +998 98 777 07 27</li>
              <li>✉️ info@yoshijodkor.uz</li>
              <li>🕐 {t("workingHours")}</li>
              <li className="pt-2">
                <Link
                  to="/admin"
                  className="text-gray-500 hover:text-gray-300 transition text-xs"
                >
                  {t("adminPanel")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Yoshijodkor.uz — {t("rights")}
        </div>
      </div>
    </footer>
  );
}
