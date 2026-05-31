export function buildTransactionFilter(userId, query = {}) {
  const filter = { userId };

  if (query.type && query.type !== "All") {
    filter.type = query.type.toLowerCase();
  }

  if (query.status && query.status !== "All") {
    const statusMap = {
      Completed: "success",
      Pending: "pending",
      Failed: "failed",
    };
    filter.status = statusMap[query.status] || query.status.toLowerCase();
  }

  if (query.days) {
    const since = new Date();
    since.setDate(since.getDate() - Number(query.days));
    filter.createdAt = { $gte: since };
  }

  if (query.search?.trim()) {
    filter.description = { $regex: query.search.trim(), $options: "i" };
  }

  return filter;
}
