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
    <li className="bg-white border-b border-blue-200 hover:bg-blue-50 transition-colors duration-150">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(product._id)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
              className="p-2 text-blue-600 hover:text-blue-800 transition-colors duration-150"
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

  // Calculate per unit price for a product
  const calculatePerUnitPrice = (product) => {
    const packPrice = parseFloat(product.price);
    const quantity = parseInt(product.quantity);
    if (quantity <= 0) return 0;
    const unitPrice = packPrice / quantity;
    return unitPrice.toFixed(2);
  };

  const generatePDF = () => {
    // Generate report for all existing products
    if (Info.length === 0) {
      alert("No products available for the report.");
      return;
    }

    const doc = new jsPDF();
    
    // Add header
    const today = new Date().toLocaleDateString();
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("Product Inventory Report", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Generated: ${today}`, doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, doc.internal.pageSize.getWidth() - 20, 35);

    // Company info
    doc.setFontSize(14);
    doc.text("Medi Cart", 20, 45);
    doc.setFontSize(10);
    doc.text("Contact: 011 298 3939", 20, 52);
    doc.text("Email: info@MediCart.lk", 20, 58);
    
    // Define table columns
    const columns = [
      { title: "Product Name", dataKey: "name" },
      { title: "Quantity", dataKey: "quantity" },
      { title: "Pack Price (Rs)", dataKey: "packPrice" },
      { title: "Mf Date", dataKey: "mfgDate" },
      { title: "Exp Date", dataKey: "expDate" }
    ];

    let totalQuantity = 0;
    let totalValue = 0;
    
    // Prepare data for table
    const data = filter.map((product) => {
      const quantity = parseInt(product.quantity) || 0;
      // Get pack price from either packPrice or price field
      const packPrice = parseFloat(product.packPrice || product.price) || 0;
      
      totalQuantity += quantity;
      totalValue += packPrice * quantity;

      return {
        name: product.ItemsN,
        quantity: quantity.toString(),
        packPrice: packPrice.toFixed(2),
        mfgDate: new Date(product.manufactureDate).toLocaleDateString(),
        expDate: new Date(product.expiryDate).toLocaleDateString()
      };
    });

    // Add total row
    data.push({
      name: "TOTAL",
      quantity: totalQuantity.toString(),
      packPrice: totalValue.toFixed(2),
      mfgDate: "",
      expDate: ""
    });

    // Generate table
    const pageWidth = doc.internal.pageSize.getWidth();
    const tableWidth = 195; // Sum of all column widths
    const leftMargin = (pageWidth - tableWidth) / 2;

    doc.autoTable({
      startY: 65,
      columns: columns,
      body: data,
      margin: { top: 65, right: leftMargin, bottom: 20, left: leftMargin },
      styles: { 
        fontSize: 9, 
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [51, 122, 183], 
        textColor: [255, 255, 255], 
        fontStyle: "bold",
        halign: "center"
      },
      alternateRowStyles: { fillColor: [240, 245, 255] },
      columnStyles: { 
        0: { cellWidth: 70, halign: "left" }, 
        1: { cellWidth: 30, halign: "center" }, 
        2: { cellWidth: 35, halign: "right" },
        3: { cellWidth: 30, halign: "center" },
        4: { cellWidth: 30, halign: "center" }
      },
      didParseCell: function(data) {
        if (data.row.index === data.table.body.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [220, 230, 241]; 
          data.cell.styles.textColor = [0, 0, 0];
        }
      },
      didDrawPage: function(data) {
        // Footer
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${data.pageNumber} of ${doc.getNumberOfPages()}`,
          data.settings.margin.left,
          pageHeight - 10
        );
        doc.text(
          "Generated by Inventory System",
          doc.internal.pageSize.getWidth() / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }
    });
    
    doc.save("ProductInventoryReport.pdf");
  };

  const generateReorderPDF = () => {
    if (reorderList.length === 0) {
      alert("Reorder list is empty. No report to generate.");
      return;
    }

    const doc = new jsPDF();
    
    // Add header
    const today = new Date().toLocaleDateString();
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("Reorder List Report", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Generated: ${today}`, doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, doc.internal.pageSize.getWidth() - 20, 35);

    // Company info
    doc.setFontSize(14);
    doc.text("Medi Cart", 20, 45);
    doc.setFontSize(10);
    doc.text("Contact: 011 298 3939", 20, 52);
    doc.text("Email: info@MediCart.lk", 20, 58);
    
    // Define table columns
    const columns = [
      { title: "Product Name", dataKey: "name" },
      { title: "Quantity", dataKey: "quantity" },
      { title: "Pack Price (Rs)", dataKey: "packPrice" },
      { title: "Mf Date", dataKey: "mfgDate" },
      { title: "Exp Date", dataKey: "expDate" }
    ];

    let totalQuantity = 0;
    let totalValue = 0;
    
    // Prepare data for reorder table
    const data = reorderList.map((product) => {
      const quantity = parseInt(product.quantity) || 0;
      // Get pack price from either packPrice or price field
      const packPrice = parseFloat(product.packPrice || product.price) || 0;
      
      totalQuantity += quantity;
      totalValue += packPrice * quantity;

      return {
        name: product.ItemsN,
        quantity: quantity.toString(),
        packPrice: packPrice.toFixed(2),
        mfgDate: new Date(product.manufactureDate).toLocaleDateString(),
        expDate: new Date(product.expiryDate).toLocaleDateString()
      };
    });

    // Add total row
    data.push({
      name: "TOTAL",
      quantity: totalQuantity.toString(),
      packPrice: totalValue.toFixed(2),
      mfgDate: "",
      expDate: ""
    });

    // Generate table
    const pageWidth = doc.internal.pageSize.getWidth();
    const tableWidth = 195; // Sum of all column widths
    const leftMargin = (pageWidth - tableWidth) / 2;

    doc.autoTable({
      startY: 65,
      columns: columns,
      body: data,
      margin: { top: 65, right: leftMargin, bottom: 20, left: leftMargin },
      styles: { 
        fontSize: 9, 
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [86, 130, 255], 
        textColor: [255, 255, 255], 
        fontStyle: "bold",
        halign: "center"
      },
      alternateRowStyles: { fillColor: [240, 245, 255] },
      columnStyles: { 
        0: { cellWidth: 70, halign: "left" }, 
        1: { cellWidth: 30, halign: "center" }, 
        2: { cellWidth: 35, halign: "right" },
        3: { cellWidth: 30, halign: "center" },
        4: { cellWidth: 30, halign: "center" }
      },
      didParseCell: function(data) {
        if (data.row.index === data.table.body.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [200, 220, 255];
          data.cell.styles.textColor = [0, 0, 0];
        }
      },
      didDrawPage: function(data) {
        // Footer
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${data.pageNumber} of ${doc.getNumberOfPages()}`,
          data.settings.margin.left,
          pageHeight - 10
        );
        doc.text(
          "Generated by Inventory System",
          doc.internal.pageSize.getWidth() / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }
    });
    
    // Add signature section
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text("Approved By: ____________________", 20, finalY + 20);
    doc.text("Date: ____________________", 20, finalY + 30);
    
    doc.text("Received By: ____________________", doc.internal.pageSize.getWidth() - 20, finalY + 20, { align: "right" });
    doc.text("Date: ____________________", doc.internal.pageSize.getWidth() - 20, finalY + 30, { align: "right" });
    
    doc.save("ReorderReport.pdf");
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
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-center text-4xl font-bold mb-8 text-blue-600">
          Product Management
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full md:w-64 px-4 py-2 rounded-full border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex space-x-4">
            <Link
              to="/add-inventory"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md transition duration-300"
            >
              <PlusIcon size={18} className="mr-2" />
              New Product
            </Link>
            <button
              onClick={generatePDF}
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md transition duration-300"
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
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md transition duration-300"
              disabled={reorderList.length === 0}
              title={reorderList.length === 0 ? "No items in reorder list" : "View Reorder List"}
            >
              <EyeIcon size={18} className="mr-2" />
              View Reorder List
              {reorderList.length > 0 && (
                <span className="ml-1 bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                  {reorderList.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b border-blue-200">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Select All</span>
            </label>
          </div>
          <ul className="divide-y divide-blue-200">
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
              <div className="flex justify-between items-center p-4 border-b border-blue-200">
                <h2 className="text-2xl font-bold text-blue-600">Reorder List</h2>
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
                  <div>
                    <div className="mb-4 bg-blue-50 p-3 rounded-md text-blue-800 text-sm">
                      {reorderList.length} item(s) in reorder list. Total value: Rs.{reorderList.reduce((sum, item) => sum + parseFloat(item.packPrice || item.price || 0), 0).toFixed(2)}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pack Price</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {reorderList.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.ItemsN}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="text-sm text-gray-500">{item.quantity}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="text-sm text-gray-900">Rs.{parseFloat(item.packPrice || item.price).toFixed(2)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="text-sm text-gray-900">Rs.{(parseFloat(item.packPrice || item.price) * parseInt(item.quantity)).toFixed(2)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => removeFromReorderList(item._id)}
                                  className="text-red-600 hover:text-red-900 focus:outline-none"
                                >
                                  <XIcon size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</td>
                            <td className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                              {reorderList.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0)}
                            </td>
                            <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                              Rs.{reorderList.reduce((sum, item) => sum + parseFloat(item.packPrice || item.price || 0), 0).toFixed(2)}
                            </td>
                            <td colSpan="2"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-6">No items in the reorder list.</p>
                )}
              </div>
              <div className="p-4 border-t border-blue-200 flex justify-end space-x-4">
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
