export class PaginationUtils {
  static paginate<T>(
    items: T[],
    total: number,
    page = 1,
    perPage = 10,
    message = 'Request processed successfully',
    statusCount?: T,
    dataExtra?: T,
  ) {
    const totalPages = Math.ceil(total / perPage);
    return {
      message,
      data: items,
      pagination: {
        total,
        page,
        perPage,
        totalPages,
      },
      statusCount,
      dataExtra,
    };
  }
}
