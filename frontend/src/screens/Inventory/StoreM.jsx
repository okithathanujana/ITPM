import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { 
  PencilIcon, 
  TrashIcon, 
  DownloadIcon, 
  PlusIcon, 
  RefreshCwIcon, 
  XIcon, 
  EyeIcon 
} from "lucide-react";

const ProductListItem = ({ product, onEdit, onDelete, onSelect, isSelected }) => {
  return (
    <li className="bg-white border-b border-yellow-200 hover:bg-yellow-50 transition-colors duration-150">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(product._id)}
            className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
          />
          <img src={product.image} alt={product.ItemsN} className="w-16 h-16 object-cover rounded-md" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{product.ItemsN}</h3>
        
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(product._id)}
              className="p-2 text-yellow-600 hover:text-yellow-800 transition-colors duration-150"
              title="Edit Product"
            >
              <PencilIcon size={18} />
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="p-2 text-red-600 hover:text-red-800 transition-colors duration-150"
              title="Delete Product"
            >
              <TrashIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default function StoreM() {
  const [Info, setInfo] = useState([]);
  const [filter, setFilter] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState({});
  const [reorderList, setReorderList] = useState(() => {
    const savedReorderList = localStorage.getItem('reorderList');
    return savedReorderList ? JSON.parse(savedReorderList) : [];
  });
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  useEffect(() => {
    const fetchinfo = async () => {
      try {
        const res = await fetch(`/api/items/IgetAll`);
        const data = await res.json();
        if (res.ok) {
          setInfo(data.items);
          setFilter(data.items);
          const initialSelectedItems = data.items.reduce((acc, item) => {
            acc[item._id] = false;
            return acc;
          }, {});
          setSelectedItems(initialSelectedItems);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchinfo();
  }, []);

  useEffect(() => {
    localStorage.setItem('reorderList', JSON.stringify(reorderList));
  }, [reorderList]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/items/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInfo((prev) => prev.filter((product) => product._id !== id));
        setFilter((prev) => prev.filter((product) => product._id !== id));
        setSelectedItems((prev) => {
          const newSelected = { ...prev };
          delete newSelected[id];
          return newSelected;
        });
        alert("Product deleted successfully!");
      } else {
        console.log("Error deleting product");
        alert("Failed to delete the product.");
      }
    } catch (error) {
      console.log(error.message);
      alert("An error occurred while deleting the product.");
    }
  };

  useEffect(() => {
    const filteredData = Info.filter(
      (product) =>
        product.ItemsN &&
        product.ItemsN.toLowerCase().includes(query.toLowerCase())
    );
    setFilter(filteredData);
  }, [query, Info]);

  const handleSelectItem = (id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const generatePDF = () => {
    const selectedProducts = Info.filter(product => selectedItems[product._id]);
    if (selectedProducts.length === 0) {
      alert("No products selected for the report.");
      return;
    }

    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();
    doc.setFontSize(18);
    doc.text("Product Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Date: ${today}`, 14, 32);
    
    const columns = [
      { title: "Name", dataKey: "name" },
      { title: "Flavor", dataKey: "flavor" },
      { title: "Quantity", dataKey: "quantity" },
      { title: "Price", dataKey: "price" },
    ];

    let totalQuantity = 0;
    let totalPrice = 0;
    const data = selectedProducts.map((product) => {
      totalQuantity += parseInt(product.quantity);
      totalPrice += parseFloat(product.price);
      return {
        name: product.ItemsN,
        flavor: product.flavor,
        quantity: product.quantity,
        price: product.price,
      };
    });

    data.push({
      name: "",
      flavor: "Total",
      quantity: totalQuantity.toString(),
      price: totalPrice.toFixed(2),
    });

    doc.autoTable({
      startY: 40,
      columns: columns,
      body: data,
      styles: { cellPadding: 1, fontSize: 10, lineHeight: 1.2, overflow: "linebreak" },
      headStyles: { fillColor: [255, 193, 7], textColor: [0, 0, 0], fontStyle: "bold" },
      columnStyles: { 
        0: { halign: "left" }, 
        1: { halign: "left" }, 
        2: { halign: "left" }, 
        3: { halign: "left" } 
      },
      didParseCell: function (data) {
        if (data.row.index === data.table.body.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [255, 255, 200];
        }
      },
    });
    
    doc.save("productReport.pdf");
  };

  const generateReorderPDF = () => {
    if (reorderList.length === 0) {
      alert("Reorder list is empty. No report to generate.");
      return;
    }

    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();
    doc.setFontSize(18);
    doc.text("Reorder Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Date: ${today}`, 14, 32);
    
    const columns = [
      { title: "Name", dataKey: "name" },
      { title: "Flavor", dataKey: "flavor" },
      { title: "Quantity", dataKey: "quantity" },
      { title: "Price", dataKey: "price" },
    ];

    let totalQuantity = 0;
    let totalPrice = 0;
    const data = reorderList.map((product) => {
      totalQuantity += parseInt(product.quantity);
      totalPrice += parseFloat(product.price);
      return {
        name: product.ItemsN,
        flavor: product.flavor,
        quantity: product.quantity,
        price: product.price,
      };
    });

    data.push({
      name: "",
      flavor: "Total",
      quantity: totalQuantity.toString(),
      price: totalPrice.toFixed(2),
    });

    doc.autoTable({
      startY: 40,
      columns: columns,
      body: data,
      styles: { cellPadding: 1, fontSize: 10, lineHeight: 1.2, overflow: "linebreak" },
      headStyles: { fillColor: [255, 193, 7], textColor: [0, 0, 0], fontStyle: "bold" },
      columnStyles: { 
        0: { halign: "left" }, 
        1: { halign: "left" }, 
        2: { halign: "left" }, 
        3: { halign: "left" } 
      },
      didParseCell: function (data) {
        if (data.row.index === data.table.body.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [255, 255, 200];
        }
      },
    });
    
    doc.save("reorderReport.pdf");
  };

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setSelectedItems(prev => {
      const newSelected = { ...prev };
      Object.keys(newSelected).forEach(key => {
        newSelected[key] = isChecked;
      });
      return newSelected;
    });
  };

  const handleReorder = () => {
    const itemsToReorder = Info.filter(product => selectedItems[product._id]);
    if (itemsToReorder.length === 0) {
      alert("No items selected for reorder.");
      return;
    }
    setReorderList(prevList => {
      // Avoid adding duplicates
      const existingIds = new Set(prevList.map(item => item._id));
      const newItems = itemsToReorder.filter(item => !existingIds.has(item._id));
      return [...prevList, ...newItems];
    });
    
    setSelectedItems(prev => {
      const newSelected = { ...prev };
      itemsToReorder.forEach(item => {
        newSelected[item._id] = false;
      });
      return newSelected;
    });

    alert(`${itemsToReorder.length} item(s) added to the reorder list.`);
  };

  const removeFromReorderList = (id) => {
    setReorderList(prevList => prevList.filter(item => item._id !== id));
  };

  const clearReorderList = () => {
    if (window.confirm("Are you sure you want to clear the entire reorder list?")) {
      setReorderList([]);
    }
  };

  const processReorder = async () => {
    if (reorderList.length === 0) {
      alert("Reorder list is empty.");
      return;
    }
    // Implement the actual API call to process reorder
    try {
      // Example API call
      /*
      const res = await fetch('/api/reorder/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: reorderList })
      });
      if (res.ok) {
        // Handle success
      } else {
        // Handle error
      }
      */
      console.log("Processing reorder for:", reorderList);
      alert("Reorder processed successfully!");
      clearReorderList();
      setIsReorderModalOpen(false);
    } catch (error) {
      console.log(error.message);
      alert("An error occurred while processing the reorder.");
    }
  };

  const isAllSelected = Info.length > 0 && Object.values(selectedItems).every(Boolean);

  return (
    <div className="min-h-screen bg-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-center text-4xl font-bold mb-8 text-yellow-600">
          Inventory Management
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full md:w-64 px-4 py-2 rounded-full border border-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex space-x-4">
            <Link
              to="/add-inventory"
              className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded-md transition duration-300"
            >
              <PlusIcon size={18} className="mr-2" />
              New Product
            </Link>
            <button
              onClick={generatePDF}
              className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded-md transition duration-300"
            >
              <DownloadIcon size={18} className="mr-2" />
              Download Report
            </button>
            <button
              onClick={handleReorder}
              className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-md transition duration-300"
            >
              <RefreshCwIcon size={18} className="mr-2" />
              Reorder Selected
            </button>
            <button
              onClick={() => setIsReorderModalOpen(true)}
              className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-md transition duration-300"
              disabled={reorderList.length === 0}
              title={reorderList.length === 0 ? "No items in reorder list" : "View Reorder List"}
            >
              <EyeIcon size={18} className="mr-2" />
              View Reorder List
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b border-yellow-200">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <span className="text-sm font-medium text-gray-700">Select All</span>
            </label>
          </div>
          <ul className="divide-y divide-yellow-200">
            {filter.length > 0 ? (
              filter.map((product) => (
                <ProductListItem
                  key={product._id}
                  product={product}
                  onEdit={(id) => {
                    window.location.href = `/update/${id}`;
                  }}
                  onDelete={handleDeleteUser}
                  onSelect={handleSelectItem}
                  isSelected={selectedItems[product._id]}
                />
              ))
            ) : (
              <li className="p-4 text-center text-gray-500 text-lg">
                No products available
              </li>
            )}
          </ul>
        </div>

        {/* Reorder Modal */}
        {isReorderModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 rounded-lg shadow-lg overflow-y-auto max-h-full">
              <div className="flex justify-between items-center p-4 border-b border-yellow-200">
                <h2 className="text-2xl font-bold text-yellow-600">Reorder List</h2>
                <button
                  onClick={() => setIsReorderModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                  title="Close"
                >
                  <XIcon size={24} />
                </button>
              </div>
              <div className="p-4">
                {reorderList.length > 0 ? (
                  <ul className="divide-y divide-yellow-200">
                    {reorderList.map((item) => (
                      <li key={item._id} className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">{item.ItemsN}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="text-lg font-bold text-yellow-600">Rs.{item.price}</p>
                          <button
                            onClick={() => removeFromReorderList(item._id)}
                            className="p-2 text-red-600 hover:text-red-800 transition-colors duration-150"
                            title="Remove from Reorder List"
                          >
                            <XIcon size={18} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500">No items in the reorder list.</p>
                )}
              </div>
              <div className="p-4 border-t border-yellow-200 flex justify-end space-x-4">
                <button
                  onClick={generateReorderPDF}
                  className={`inline-flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white font-bold px-4 py-2 rounded-md transition duration-300 ${
                    reorderList.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={reorderList.length === 0}
                >
                  <DownloadIcon size={18} className="mr-2" />
                  Download Reorder Report
                </button>
                <button
                  onClick={processReorder}
                  className={`bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-md transition duration-300 ${
                    reorderList.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={reorderList.length === 0}
                >
                  Process Reorder
                </button>
                <button
                  onClick={clearReorderList}
                  className={`bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-md transition duration-300 ${
                    reorderList.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={reorderList.length === 0}
                >
                  Clear List
                </button>
                <button
                  onClick={() => setIsReorderModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-4 py-2 rounded-md transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
