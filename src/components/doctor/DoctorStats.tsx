import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, DollarSign, Users } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
}

const StatsCard = ({ title, value, icon, description }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </CardContent>
  </Card>
);

const DoctorStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Appointments"
        value="24"
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Patients"
        value="12"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Success Rate"
        value="98%"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Earnings"
        value="$1,234"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};

export default DoctorStats;