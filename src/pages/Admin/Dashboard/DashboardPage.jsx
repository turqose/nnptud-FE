import { Menu } from "@headlessui/react";
import {
    ArrowDown,
    ArrowUp,
    Download,
    Eye,
    MoreHorizontal,
    Star,
    UserPlus,
    Users,
} from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 25000, expenses: 45000 },
  { month: "Feb", revenue: 35000, expenses: 40000 },
  { month: "Mar", revenue: 45000, expenses: 50000 },
  // Add more data points as needed
];

const hourlyData = [
  { hour: "12 AM", value: 30 },
  { hour: "4 AM", value: 45 },
  { hour: "8 AM", value: 75 },
  { hour: "4 PM", value: 90 },
  { hour: "8 PM", value: 60 },
  { hour: "11 PM", value: 40 },
];

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0B1E] text-white p-8 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, John</h1>
          <p className="text-gray-400 text-sm">
            Measure your advertising ROI and report website traffic
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 text-white border border-gray-600 rounded-lg hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export data
          </button>
          <button className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700">
            Create report
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Pageviews"
          value="50.8K"
          change={8.45}
          icon={<Eye className="w-4 h-4" />}
        />
        <MetricCard
          title="Monthly users"
          value="23.6K"
          change={-2.71}
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          title="New sign ups"
          value="756"
          change={4.31}
          icon={<UserPlus className="w-4 h-4" />}
        />
        <MetricCard
          title="Subscriptions"
          value="2.3K"
          change={11.31}
          icon={<Star className="w-4 h-4" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="col-span-2 bg-[#0D0E2A] border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">Total revenue</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">$240.8K</span>
                <span className="text-green-500 text-sm">+24.85%</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm text-gray-400">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-sm text-gray-400">Expenses</span>
              </div>
              <Menu as="div" className="relative">
                <Menu.Button className="p-2 hover:bg-gray-700 rounded-lg">
                  <MoreHorizontal className="w-4 h-4" />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-[#0D0E2A] border border-gray-800 rounded-lg shadow-lg">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-700" : ""
                        } w-full text-left px-4 py-2 text-sm`}
                      >
                        View Details
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-700" : ""
                        } w-full text-left px-4 py-2 text-sm`}
                      >
                        Export Data
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D3F" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0D0E2A",
                  border: "1px solid #374151",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#A855F7"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#06B6D4"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Total Profit */}
          <div className="bg-[#0D0E2A] border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Total profit</h3>
              <span className="text-green-500 text-sm">+28.5%</span>
            </div>
            <div className="text-2xl font-bold mb-4">$144.6K</div>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={hourlyData}>
                <Bar dataKey="value" fill="#A855F7" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Total Sessions */}
          <div className="bg-[#0D0E2A] border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Total sessions</h3>
              <span className="text-green-500 text-sm">+16.8%</span>
            </div>
            <div className="text-2xl font-bold mb-4">400</div>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={hourlyData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#A855F7"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

function MetricCard({ title, value, change, icon }) {
  const isPositive = change > 0;

  return (
    <div className="bg-[#0D0E2A] border border-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 hover:bg-gray-700 rounded-lg">
            <MoreHorizontal className="w-4 h-4" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-[#0D0E2A] border border-gray-800 rounded-lg shadow-lg">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-700" : ""
                  } w-full text-left px-4 py-2 text-sm`}
                >
                  View Details
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-700" : ""
                  } w-full text-left px-4 py-2 text-sm`}
                >
                  Export Data
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <div
          className={`flex items-center ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          <span className="text-sm">{Math.abs(change)}%</span>
        </div>
        <span className="text-gray-400 text-sm">vs last month</span>
      </div>
    </div>
  );
}
export default DashboardPage;
