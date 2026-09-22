import api from "./api";

const AuditLogService = {
  async getAuditLogs(params = {}) {
    const response = await api.get("/audit-logs/", {
      params,
    });

    return response.data;
  },
};

export default AuditLogService;