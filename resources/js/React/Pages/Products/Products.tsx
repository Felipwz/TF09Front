
import ProductList from "@app/js/React/components/ProductList/ProductList";
import ProductCreateForm from "@app/js/React/components/ProductCreateForm/ProductCreateForm";
import Pagination from "@app/js/React/components/Pagination/Pagination";
import { useEffect, useState, useRef } from "react";
import { ProductModel } from "@app/js/app.types";
import productListApi from "@app/js/services/api/productListApi";
import { DEBOUNCE_MILISECONDS } from "@app/js/constants";

export default function Products() {

    const [productList, setProductList] = useState<ProductModel[] | "error">();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");
    
    // Ref para armazenar o ID do timeout do debounce
    const debounceTimerRef = useRef<number | null>(null);

    // Efeito para listar produtos quando mudam: página ou query de busca
    useEffect(() => {
        listApi();
    }, [currentPage, searchQuery]);

    // Efeito para implementar debounce na busca
    useEffect(() => {
        // Limpa o timeout anterior
        if (debounceTimerRef.current !== null) {
            clearTimeout(debounceTimerRef.current);
        }

        // Cria novo timeout
        debounceTimerRef.current = window.setTimeout(() => {
            setSearchQuery(inputValue);
            // Volta para página 1 quando faz nova busca
            setCurrentPage(1);
        }, DEBOUNCE_MILISECONDS);

        // Cleanup: limpa o timeout quando o componente desmonta ou inputValue muda
        return () => {
            if (debounceTimerRef.current !== null) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [inputValue]);

    const listApi = async () => {
        const resp = await productListApi({
            limit: 10,
            page: currentPage,
            query: searchQuery
        });

        if ("error" in resp) return setProductList("error");

        setProductList(resp.rows);
        
        // Calcula o total de páginas
        const total = Math.ceil(resp.count / 10);
        setTotalPages(total);
    };

    const createProductHandler = () => {
        listApi();
    };

    const deleteProductHandler = () => {
        listApi();
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="row g-4">
            {/* Campo de busca com debounce */}
            <div className="col-12">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar produtos..."
                    value={inputValue}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Formulário de criação */}
            <ProductCreateForm onCreate={createProductHandler} />
            
            {/* Lista de produtos */}
            <ProductList products={productList} onDelete={deleteProductHandler} />
            
            {/* Paginação */}
            {productList && productList !== "error" && productList.length > 0 && (
                <div className="col-12 d-flex justify-content-center">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
