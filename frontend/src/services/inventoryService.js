import api from "./api";

const InventoryService = {
  async getInventory() {
    const response = await api.get("/inventory");

    return response.data;
  },

  async stockIn(data) {
    const response = await api.post(
      "/inventory/stock-in",
      data
    );

    return response.data;
  },

  async stockOut(data) {
    const response = await api.post(
      "/inventory/stock-out",
      data
    );

    return response.data;
  },

  async adjustStock(data) {
    const response = await api.post(
      "/inventory/adjust",
      data
    );

    return response.data;
  },

  async getProductHistory(productId) {
    const response = await api.get(
      `/inventory/${productId}/history`
    );

    return response.data;
  },
};

export default InventoryService;