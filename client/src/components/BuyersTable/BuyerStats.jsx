import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Tag, Mail, MailCheck } from "lucide-react";

/**
 * BuyerStats component - Displays overview stats cards for buyers
 * 
 * @param {Object} props
 * @param {Object} props.stats - Statistics about buyers (total, vip, byArea, byType)
 * @param {number} props.selectedCount - Number of currently selected buyers
 */
const BuyerStats = ({ stats, selectedCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <Card.Content className="p-4 flex flex-col items-center justify-center">
          <Users className="h-8 w-8 text-[#324c48] mb-2" />
          <p className="text-sm text-gray-500">Total Buyers</p>
          <p className="text-3xl font-bold text-[#324c48]">{stats.total}</p>
        </Card.Content>
      </Card>
      
      <Card>
        <Card.Content className="p-4 flex flex-col items-center justify-center">
          <Tag className="h-8 w-8 text-[#D4A017] mb-2" />
          <p className="text-sm text-gray-500">VIP Subscribers</p>
          <p className="text-3xl font-bold text-[#D4A017]">{stats.vip}</p>
        </Card.Content>
      </Card>
      
      <Card>
        <Card.Content className="p-4 flex flex-col items-center justify-center">
          <Mail className="h-8 w-8 text-[#3f4f24] mb-2" />
          <p className="text-sm text-gray-500">Selected for Email</p>
          <p className="text-3xl font-bold text-[#3f4f24]">{selectedCount}</p>
        </Card.Content>
      </Card>
      
      <Card>
        <Card.Content className="p-4 flex flex-col items-center justify-center">
          <MailCheck className="h-8 w-8 text-[#546930] mb-2" />
          <p className="text-sm text-gray-500">Email-Ready Buyers</p>
          <p className="text-3xl font-bold text-[#546930]">
            {/* Assuming not unsubscribed buyers is the same as total for this example */}
            {stats.total}
          </p>
        </Card.Content>
      </Card>
    </div>
  );
};

export default BuyerStats;