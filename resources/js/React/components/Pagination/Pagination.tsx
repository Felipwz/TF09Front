import { PaginationProps } from "./Pagination.types";

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    
    // Se não há páginas ou só há uma página, não mostra a paginação
    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        onPageChange(page);
    };

    return (
        <nav aria-label="Navegação de páginas">
            <ul className="pagination mb-0">
                {/* Botão Anterior */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                        className="page-link" 
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        aria-label="Anterior"
                    >
                        Anterior
                    </button>
                </li>

                {/* Indicador de página atual */}
                <li className="page-item active">
                    <span className="page-link">
                        Página {currentPage} de {totalPages}
                    </span>
                </li>

                {/* Botão Próximo */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                        className="page-link" 
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        aria-label="Próximo"
                    >
                        Próximo
                    </button>
                </li>
            </ul>
        </nav>
    );
}
