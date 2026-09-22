import { useEffect, useState } from "react";
import {
  ClipboardList,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

import AuditLogService from "../../services/auditLogService";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [userId, setUserId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    loadAuditLogs();
  }, [page]);

  async function loadAuditLogs() {
    try {
      setLoading(true);
      setError("");

      const response =
        await AuditLogService.getAuditLogs({
          page,
          limit,
          action: action || undefined,
          entity_type:
            entityType || undefined,
          user_id: userId || undefined,
        });

      const data = response.data ?? response;

      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        setLogs(data.items ?? data.results ?? []);
      }
    } catch (error) {
      console.error("Audit logs error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to load audit logs."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();

    setPage(1);
    loadAuditLogs();
  }

  function clearFilters() {
    setAction("");
    setEntityType("");
    setUserId("");
    setPage(1);

    setTimeout(() => {
      loadAuditLogs();
    }, 0);
  }

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();
  }

  function getActionClass(action) {
    if (!action) {
      return "audit-action-default";
    }

    if (
      action.includes("STOCK_IN") ||
      action.includes("CREATE")
    ) {
      return "audit-action-success";
    }

    if (
      action.includes("STOCK_OUT") ||
      action.includes("DELETE")
    ) {
      return "audit-action-danger";
    }

    if (
      action.includes("UPDATE") ||
      action.includes("ADJUST")
    ) {
      return "audit-action-warning";
    }

    return "audit-action-default";
  }

  return (
    <div className="audit-page">
      <div className="audit-header">
        <div>
          <h1>Audit Logs</h1>
          <p>
            Track system activity and user actions.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={loadAuditLogs}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "spin" : ""}
          />
          Refresh
        </button>
      </div>

      <form
        className="audit-filters"
        onSubmit={handleSearch}
      >
        <div className="audit-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Action e.g. STOCK_IN"
            value={action}
            onChange={(event) =>
              setAction(event.target.value)
            }
          />
        </div>

        <input
          className="audit-filter-input"
          type="text"
          placeholder="Entity type"
          value={entityType}
          onChange={(event) =>
            setEntityType(event.target.value)
          }
        />

        <input
          className="audit-filter-input"
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(event) =>
            setUserId(event.target.value)
          }
        />

        <button
          type="submit"
          className="audit-filter-button"
        >
          <Search size={16} />
          Filter
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={clearFilters}
        >
          Clear
        </button>
      </form>

      {error && (
        <div className="products-error">
          {error}
        </div>
      )}

      <div className="audit-card">
        {loading ? (
          <div className="products-loading">
            Loading audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="audit-empty">
            <ClipboardList size={40} />

            <h3>No audit logs found</h3>

            <p>
              No system activity matches the
              selected filters.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Description</th>
                  <th>User</th>
                  <th>IP Address</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      {formatDate(log.created_at)}
                    </td>

                    <td>
                      <span
                        className={`audit-action ${getActionClass(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td>
                      <div className="audit-entity">
                        <strong>
                          {log.entity_type || "-"}
                        </strong>

                        {log.entity_id && (
                          <span>
                            {log.entity_id}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className="audit-description">
                        {log.description || "-"}
                      </span>
                    </td>

                    <td>
                      {log.user?.full_name ||
                        log.username ||
                        log.user_id ||
                        "System"}
                    </td>

                    <td>
                      {log.ip_address || "-"}
                    </td>

                    <td>
                      <button
                        className="icon-button"
                        title="View audit log"
                        onClick={() =>
                          setSelectedLog(log)
                        }
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="audit-pagination">
        <span>
          Page {page}
        </span>

        <div>
          <button
            className="icon-button"
            disabled={page === 1 || loading}
            onClick={() =>
              setPage((previous) =>
                Math.max(1, previous - 1)
              )
            }
          >
            <ChevronLeft size={17} />
          </button>

          <button
            className="icon-button"
            disabled={
              loading || logs.length < limit
            }
            onClick={() =>
              setPage((previous) =>
                previous + 1
              )
            }
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      {selectedLog && (
        <AuditLogModal
          log={selectedLog}
          onClose={() =>
            setSelectedLog(null)
          }
        />
      )}
    </div>
  );
}

function AuditLogModal({ log, onClose }) {
  return (
    <div className="audit-modal-overlay">
      <div className="audit-modal">
        <div className="audit-modal-header">
          <div>
            <h2>Audit Log Details</h2>
            <p>
              Full details of this system activity.
            </p>
          </div>

          <button
            className="category-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="audit-details">
          <div>
            <span>Action</span>
            <strong>{log.action || "-"}</strong>
          </div>

          <div>
            <span>Entity Type</span>
            <strong>
              {log.entity_type || "-"}
            </strong>
          </div>

          <div>
            <span>Entity ID</span>
            <strong>
              {log.entity_id || "-"}
            </strong>
          </div>

          <div>
            <span>User</span>
            <strong>
              {log.username  || "System"}
            </strong>
          </div>

          <div>
            <span>IP Address</span>
            <strong>
              {log.ip_address || "-"}
            </strong>
          </div>

          <div>
            <span>Date</span>
            <strong>
              {log.created_at
                ? new Date(
                    log.created_at
                  ).toLocaleString()
                : "-"}
            </strong>
          </div>

          <div className="audit-detail-description">
            <span>Description</span>
            <p>
              {log.description || "-"}
            </p>
          </div>
        </div>

        <div className="category-modal-actions">
          <button
            className="modal-cancel-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}