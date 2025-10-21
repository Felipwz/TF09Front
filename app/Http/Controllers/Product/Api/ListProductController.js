import ProductModel from "../../../../Models/ProductModel.js";
import { Op } from 'sequelize';

export default async function ListProductController(request, response) {

    const HTTP_STATUS = CONSTANTS.HTTP;

    const ALLOWED_ORDER_FIELDS = ["id", "name"];

    const ALLOWED_ORDER_DIRECTION = ["asc", "desc"];

    const limit = parseInt(request.query.limit) || 100;
    const page = parseInt(request.query.page) || 1;
    const orderBy = request.query.orderBy || "id,asc";
    const query = request.query.query || "";

    // Calcula o offset com base na página
    const offset = (page - 1) * limit;

    const [orderField, orderDirection] = orderBy.split(",");

    if (!ALLOWED_ORDER_FIELDS.includes(orderField)) {
        return response.status(HTTP_STATUS.BAD_REQUEST).json({ error: `Campo Order By incorreto: ${orderField}.` });
    }

    if (!ALLOWED_ORDER_DIRECTION.includes(orderDirection)) {
        return response.status(HTTP_STATUS.BAD_REQUEST).json({ error: `Direção Order By incorreto: ${orderDirection}.` });
    }


    if (limit > CONSTANTS.MAX_GET_LIMIT) {
        return response.status(HTTP_STATUS.BAD_REQUEST).json({ error: `Limit máximo: ${CONSTANTS.MAX_GET_LIMIT}.` });
    }

    try {

        // Configura o filtro de busca
        const whereClause = query ? {
            name: {
                [Op.iLike]: `%${query}%`
            }
        } : {};

        const { rows, count } = await ProductModel.findAndCountAll({
            where: whereClause,
            limit: limit + 1,
            offset: offset,
            order: [[orderField, orderDirection]]
        });

        const hasMore = (rows.length > limit);

        const data = (hasMore) ? (rows.slice(0, limit)) : (rows);
        const next = (hasMore) ? (page + 1) : (null);

        return response.status(HTTP_STATUS.SUCCESS).json({
            rows: data,
            count: count,
            limit: limit,
            next: next
        });

    } catch (error) {
        console.log(error);
        return response.status(HTTP_STATUS.SERVER_ERROR).json({ error: 'Error de servidor.' })
    }

};
