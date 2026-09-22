import api from "./api";

const CategoryService = {
  async getCategories(params = {}) {
    const response = await api.get("/categories", {
      params,
    });

    return response.data;
  },
};

export default CategoryService;