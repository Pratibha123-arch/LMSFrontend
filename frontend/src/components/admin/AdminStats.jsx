// src/components/admin/AdminStats.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const AdminStats = () => {
  // Example stats data - replace with API data
  const stats = [
    { title: "Total Users", value: "1,200" },
    { title: "Active Courses", value: "85" },
    { title: "Subscriptions", value: "450" },
    { title: "Revenue", value: "$12,500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <Card key={idx} className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-gray-500">{stat.title}</h3>
            <p className="text-2xl font-bold text-indigo-600">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
