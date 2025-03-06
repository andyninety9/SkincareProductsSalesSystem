// eslint-disable-next-line react/prop-types
export default function LiveSearchProduct({ onClose, autoFocus }) {
    return (
        <div className="live-search-container">
            <div className="search-header">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    autoFocus={autoFocus}
                    // ...
                />
                <button className="close-search-btn" onClick={onClose}>
                    &times;
                </button>
            </div>
            
        </div>
    );
}
