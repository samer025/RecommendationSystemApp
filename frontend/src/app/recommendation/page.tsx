"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { api_url } from "@/api";

const styles = {
  background: {
    minHeight: "100vh",
    width: "100vw",
    background:
      "linear-gradient(135deg, #4f8ef7 , #2c3e50 ,#005baa,  #008acb, #00c3dd, #00e9b7, #2ad379, #f9cb38, #f29400, #ef4136, #d51e5b, #702082)",
    animation: "gradient  10s ease infinite ",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 40,
    maxWidth: 600,
    width: "100%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: "contain" as const,
    borderRadius: "50%",
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: "#1e2a38",
  },
  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: "600" as const,
    color: "#33475b",
  },
  input: {
    padding: "12px 15px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginBottom: 25,
    width: "100%",
    boxSizing: "border-box" as const,
    transition: "border-color 0.3s ease",
  },
  select: {
    padding: "12px 15px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginBottom: 25,
    width: "100%",
    cursor: "pointer",
  },
  button: {
    backgroundColor: "#4f8ef7",
    color: "white",
    padding: "14px 20px",
    fontSize: 18,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: "700" as const,
    width: "100%",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "#d32f2f",
    marginTop: 10,
    fontWeight: "600",
  },
  list: {
    marginTop: 30,
    listStyleType: "none",
    paddingLeft: 0,
    color: "#1e2a38",
    width: "100%",
    maxWidth: 600,
  },
  listItem: {
    padding: 12,
    borderBottom: "1px solid #ddd",
    fontSize: 17,
    whiteSpace: "normal",
  },
};

export default function RecommendationPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [model, setModel] = useState("lightfm");
  const [recs, setRecs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirection si pas de token (pas connecté)
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const fetchRecommendations = async () => {
    if (!userId.trim()) {
      setError(" Enter a user ID.");
      setRecs([]);
      return;
    }

    setLoading(true);
    setError(null);
    setRecs([]);

    try {
      const res = await fetch(
        `${api_url}/recommend/${model}/${userId}?top_n=3`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Si ton backend attend token ici
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Erreur serveur: ${res.status}`);
      }

      const data = await res.json();

      if (Array.isArray(data.recommendations)) {
        setRecs(data.recommendations);
      } else {
        setError("Format de réponse inattendu : pas de tableau recommendations");
      }
    } catch (err: any) {
      setError(err.message || "Error while recuperation");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (recs.length === 0) {
      alert("NO recommendation to export.");
      return;
    }

    const csvRows = [
      ["user_id", "model", "recommended_offer"],
      ...recs.map((offer) => [userId, model.toUpperCase(), offer]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `recommendations_${userId}_${model}.csv`);
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };

  if (!token) return null; // ou un loader

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <header style={styles.header}>
          <img src="/TT+.PNG" alt="Logo TT" style={styles.logo} />
          <h1 style={styles.title}>Mobile Offers Recommender System</h1>
        </header>

        <label style={styles.label}> Enter a user ID :</label>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <label style={styles.label}>Choose model :</label>
        <select
          style={styles.select}
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          
          <option value="lightfm">LightFM</option>
          
        </select>

        <button
          style={styles.button}
          onClick={fetchRecommendations}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Get recommendations "}
        </button>

        {error && <p style={styles.error}>{error}</p>}

        {recs.length > 0 && (
          <>
            <ul style={styles.list}>
              {recs.map((r, i) => (
                <li key={i} style={styles.listItem}>
                  {r}
                </li>
              ))}
            </ul>
            <button
              style={{ ...styles.button, marginTop: 20 }}
              onClick={exportToCSV}
            >
              📥 Export to csv
            </button>
             <button
        onClick={() => router.push('/login')}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
        title="Retour à l'accueil"
      >
        🏠
      </button>
          </>
        )}
      </div>
    </div>
  );
}
