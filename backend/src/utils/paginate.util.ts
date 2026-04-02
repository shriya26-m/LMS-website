export interface PaginationOptions {
    page?: number;
    limit?: number;
}

export interface PaginationResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export const paginate = <T>(
    data: T[],
    total: number,
    options: PaginationOptions
): PaginationResult<T> => {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
};
