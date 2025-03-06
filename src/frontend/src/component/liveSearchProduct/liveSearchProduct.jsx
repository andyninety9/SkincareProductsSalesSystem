import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

// eslint-disable-next-line react/prop-types
export default function LiveSearchProduct({ onClose, autoFocus }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        // Don't search if the term is too short
        if (!searchTerm || searchTerm.length < 2) {
            setSearchResults([]);
            return;
        }

        setLoading(true);

        // Create a debounce timer
        const debounceTimer = setTimeout(() => {
            performSearch(searchTerm);
        }, 300); 
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const performSearch = async (term) => {
        try {
            const response = await api.get(`products?keyword=${encodeURIComponent(term)}`);
            setSearchResults(response.data.data.items);
        } catch (error) {
            console.error('Error searching products:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="live-search-container">
            <div className="search-header">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    autoFocus={autoFocus}
                />
                <button className="close-search-btn" onClick={onClose}>
                    &times;
                </button>
            </div>
            
        </div>
    );
}
