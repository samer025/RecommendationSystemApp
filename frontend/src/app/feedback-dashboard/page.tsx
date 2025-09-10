"use client"

import React, { useEffect, useState } from "react"; 
import AverageRatingChart from "../components/dashboard/AverageRatingChart"; 
import RatingDistributionChart from "../components/dashboard/RatingDistributionChart"; 
import StatCard from "../components/dashboard/StatCard"; 
import AdminLayout from "../../layout/AdminLayout";
import { api_url } from "@/api";

type Stats = { 
  totalFeedbacks: number; 
  globalAverage: number; 
  ratingDistribution: Record<string, number>; 
  averagePerOffer: { offer: string; avg: number; count: number }[]; 
}; 

export default function FeedbackDashboardPage() { 
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Use the Docker service name instead of localhost
        const res = await fetch(`${api_url}/feedback/stats`, { 
        }); 
        
        if (!res.ok) throw new Error("Impossible de récupérer les stats"); 
        
        const data: Stats = await res.json(); 
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Chargement...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 dark:text-red-400">Erreur: {error}</div>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</div>
        </div>
      </AdminLayout>
    );
  }

  return ( 
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            📊 Dashboard Feedbacks
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Statistiques et analyses des feedbacks utilisateurs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"> 
          <StatCard 
            title="Total feedbacks" 
            value={stats.totalFeedbacks.toString()} 
            icon="📋"
            trend="up"
          /> 
          <StatCard 
            title="Note moyenne" 
            value={stats.globalAverage.toFixed(2)} 
            icon="⭐"
            trend="neutral"
          /> 
          <StatCard 
            title="Offres évaluées" 
            value={stats.averagePerOffer.length.toString()} 
            icon="🏆"
            trend="down"
          /> 
        </div> 
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700"> 
            <h2 className="font-semibold text-gray-800 dark:text-white/90 mb-4">
              Distribution des notes
            </h2> 
            <RatingDistributionChart distribution={stats.ratingDistribution} /> 
          </div> 
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700"> 
            <h2 className="font-semibold text-gray-800 dark:text-white/90 mb-4">
              Moyenne par offre (top 10)
            </h2> 
            <AverageRatingChart data={stats.averagePerOffer} /> 
          </div> 
        </div> 
      </div>
    </AdminLayout>
  ); 
}