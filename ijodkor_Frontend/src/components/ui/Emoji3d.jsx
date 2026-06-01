// 3D emoji icon mapping — Microsoft Fluent Emoji
const BASE = "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets";

// Default skin tone yo'q bo'lganlar
const map = {
  "🎨": `${BASE}/Artist%20palette/3D/artist_palette_3d.png`,
  "🪡": `${BASE}/Sewing%20needle/3D/sewing_needle_3d.png`,
  "✂️": `${BASE}/Scissors/3D/scissors_3d.png`,
  "🧵": `${BASE}/Thread/3D/thread_3d.png`,
  "👗": `${BASE}/Dress/3D/dress_3d.png`,
  "🧸": `${BASE}/Teddy%20bear/3D/teddy_bear_3d.png`,
  "🎁": `${BASE}/Wrapped%20gift/3D/wrapped_gift_3d.png`,
  "🎉": `${BASE}/Party%20popper/3D/party_popper_3d.png`,
  "📚": `${BASE}/Books/3D/books_3d.png`,
  "💻": `${BASE}/Laptop/3D/laptop_3d.png`,
  "⭐": `${BASE}/Star/3D/star_3d.png`,
  "🏫": `${BASE}/School/3D/school_3d.png`,
  "🌿": `${BASE}/Herb/3D/herb_3d.png`,
  "⚡": `${BASE}/High%20voltage/3D/high_voltage_3d.png`,
  "💳": `${BASE}/Credit%20card/3D/credit_card_3d.png`,
  "🚀": `${BASE}/Rocket/3D/rocket_3d.png`,
  "📖": `${BASE}/Open%20book/3D/open_book_3d.png`,
  "🔬": `${BASE}/Microscope/3D/microscope_3d.png`,
  "💼": `${BASE}/Briefcase/3D/briefcase_3d.png`,
  "🧠": `${BASE}/Brain/3D/brain_3d.png`,
  "☪️": `${BASE}/Star%20and%20crescent/3D/star_and_crescent_3d.png`,
  "🏛️": `${BASE}/Classical%20building/3D/classical_building_3d.png`,
  "🌐": `${BASE}/Globe%20with%20meridians/3D/globe_with_meridians_3d.png`,
  "📰": `${BASE}/Newspaper/3D/newspaper_3d.png`,
  "🌾": `${BASE}/Sheaf%20of%20rice/3D/sheaf_of_rice_3d.png`,
  "📕": `${BASE}/Closed%20book/3D/closed_book_3d.png`,
  "👑": `${BASE}/Crown/3D/crown_3d.png`,
  "🎓": `${BASE}/Graduation%20cap/3D/graduation_cap_3d.png`,
  "🔐": `${BASE}/Locked%20with%20key/3D/locked_with_key_3d.png`,
  "🔒": `${BASE}/Locked/3D/locked_3d.png`,
  "✉️": `${BASE}/Envelope/3D/envelope_3d.png`,
  "📧": `${BASE}/E-mail/3D/e-mail_3d.png`,
  "📞": `${BASE}/Telephone%20receiver/3D/telephone_receiver_3d.png`,
  "📱": `${BASE}/Mobile%20phone/3D/mobile_phone_3d.png`,
  "✨": `${BASE}/Sparkles/3D/sparkles_3d.png`,
  "🎯": `${BASE}/Bullseye/3D/bullseye_3d.png`,
  "💡": `${BASE}/Light%20bulb/3D/light_bulb_3d.png`,
  "💎": `${BASE}/Gem%20stone/3D/gem_stone_3d.png`,
  "🏆": `${BASE}/Trophy/3D/trophy_3d.png`,
  "🎊": `${BASE}/Confetti%20ball/3D/confetti_ball_3d.png`,
  "📍": `${BASE}/Round%20pushpin/3D/round_pushpin_3d.png`,
  "🗺️": `${BASE}/World%20map/3D/world_map_3d.png`,
  "💰": `${BASE}/Money%20bag/3D/money_bag_3d.png`,
  "💵": `${BASE}/Dollar%20banknote/3D/dollar_banknote_3d.png`,
  "📊": `${BASE}/Bar%20chart/3D/bar_chart_3d.png`,
  "📦": `${BASE}/Package/3D/package_3d.png`,
  "🛒": `${BASE}/Shopping%20cart/3D/shopping_cart_3d.png`,
  "🔔": `${BASE}/Bell/3D/bell_3d.png`,
  "🎂": `${BASE}/Birthday%20cake/3D/birthday_cake_3d.png`,
  "❤️": `${BASE}/Red%20heart/3D/red_heart_3d.png`,
  "🇺🇿": `${BASE}/Flag%20uzbekistan/3D/flag_uzbekistan_3d.png`,
  "🇷🇺": `${BASE}/Flag%20russia/3D/flag_russia_3d.png`,
  "🌟": `${BASE}/Glowing%20star/3D/glowing_star_3d.png`,
  "📷": `${BASE}/Camera/3D/camera_3d.png`,
  "▶️": `${BASE}/Play%20button/3D/play_button_3d.png`,
  "📘": `${BASE}/Blue%20book/3D/blue_book_3d.png`,
  "❌": `${BASE}/Cross%20mark/3D/cross_mark_3d.png`,
  "✅": `${BASE}/Check%20mark%20button/3D/check_mark_button_3d.png`,
  "⚙️": `${BASE}/Gear/3D/gear_3d.png`,
  "🥺": `${BASE}/Pleading%20face/3D/pleading_face_3d.png`,
};

// Skin tone bilan kelganlar — Default subfolder
const skinTone = {
  "💪": `${BASE}/Flexed%20biceps/Default/3D/flexed_biceps_3d_default.png`,
  "👋": `${BASE}/Waving%20hand/Default/3D/waving_hand_3d_default.png`,
  "👤": `${BASE}/Bust%20in%20silhouette/3D/bust_in_silhouette_3d.png`,
};

export const emoji3dUrl = (e) => map[e] || skinTone[e] || null;

export default function Emoji3d({
  e,
  size = 20,
  className = "",
  style = {},
  alt = "",
}) {
  const src = emoji3dUrl(e);
  if (!src) {
    return (
      <span className={className} style={{ fontSize: size, ...style }}>
        {e}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={alt || e}
      loading="lazy"
      className={`inline-block object-contain ${className}`}
      style={{ width: size, height: size, ...style }}
    />
  );
}
