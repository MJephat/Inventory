import api from "./api";

const DashboardService = {
  async getSummary() {
    const response = await api.get("/dashboard/summary");
    return response.data;
  },

  async getRecentActivity(limit = 10) {
    const response = await api.get(
      `/dashboard/recent-activity?limit=${limit}`
    );

    return response.data;
  },

  async getLowStockProducts() {
    const response = await api.get("/dashboard/low-stock");
    return response.data;
  },

  async getDashboardData() {
    const [summary, recentActivity, lowStockProducts] =
      await Promise.all([
        this.getSummary(),
        this.getRecentActivity(10),
        this.getLowStockProducts(),
      ]);

    return {
      summary,
      recentActivity,
      lowStockProducts,
    };
  },
};

export default DashboardService;