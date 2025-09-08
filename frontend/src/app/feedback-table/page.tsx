// src/app/feedback-table/page.tsx
import React from "react";
import AdminLayout from "@/layout/AdminLayout";
import FeedbackTable from "@/app/components/feedback/FeedbackTable";

export default function FeedbackTablePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            📊 Tableau des Feedbacks
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Consultation de tous les feedbacks enregistrés dans la base de données
          </p>
        </div>

        <FeedbackTable />
      </div>
    </AdminLayout>
  );
}