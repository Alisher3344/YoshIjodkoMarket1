import { useEffect, useState } from "react";
import { api } from "../lib/api";

const formatPrice = (n) => (n || 0).toLocaleString("uz-UZ") + " so'm";

export default function Home({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProducts()
      .then((list) => setProducts(list || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app">
      <div className="card">
        <h1>👋 Salom, {user.name || user.full_name}</h1>
        <p className="muted">
          {user.phone && <>📞 {user.phone}</>}
        </p>
      </div>

      <div className="card">
        <h2>🎨 Mahsulotlar</h2>
        {loading ? (
          <div className="spinner" />
        ) : products.length === 0 ? (
          <p className="muted">Mahsulotlar yo'q</p>
        ) : (
          <div className="product-list">
            {products.slice(0, 20).map((p) => (
              <div key={p.id} className="product">
                {p.image ? (
                  <img className="product-img" src={p.image} alt="" />
                ) : (
                  <div
                    className="product-img"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 32,
                    }}
                  >
                    📦
                  </div>
                )}
                <div className="product-name">{p.name_uz || p.nameUz}</div>
                <div className="product-price">{formatPrice(p.price)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
