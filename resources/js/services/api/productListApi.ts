import { ListApi, ProductModel } from "@app/js/app.types";
import { baseAxios } from "../axiosApi";
import catchError from "../catchError";

interface ProductListApiParams {
    limit?: number;
    orderBy?: string;
    page?: number;
    query?: string;
}

export default async function productListApi(params: ProductListApiParams = {}) {
    const { limit = 15, orderBy = "id,desc", page = 1, query = "" } = params;

    const searchParams = new URLSearchParams({
        "orderBy": orderBy,
        "limit": limit.toString(),
        "page": page.toString()
    });

    if (query) {
        searchParams.append("query", query);
    }

    try {
        const { data } = await baseAxios.get<ListApi<ProductModel>>(`api/products?${searchParams}`);

        return data;
    } catch (error) {
        return catchError(error);
    }
}
