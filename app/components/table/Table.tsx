"use client";

import { useEffect, useState } from "react";


import "./table.css";

import "react-toastify/dist/ReactToastify.css";
import { Modal } from "bootstrap";
import Link from "next/link";

import { Spinner } from "react-bootstrap";
import { OrderWithUser} from "@/types/order-with-user";
import { Product } from "@/types/product";

interface selectedOrderItemProp{
  cart_id: number,
  quantity: number,
  product: Product
}


export default function Table({ orders, changeOrderStatus }: { 
  orders: OrderWithUser[]; 
  changeOrderStatus: (index: number) => void; 
}) {

  // Component State
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(5); // Default 5

  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(null);

  useEffect(() => {
    if (selectedOrder) {
      const modalElement = document.getElementById("orderDetailsModal");
      if (modalElement) {
        const modalInstance = new Modal(modalElement);
        modalInstance.show();
      }
    }
  }, [selectedOrder]);

  const [filteredOders, setFilteredOders] = useState<OrderWithUser[]>(orders || []);

  // Ensure filteredOders updates when orders changes
  useEffect(() => {
    if (orders && orders.length > 0) {
      setFilteredOders(orders);
    }
  }, [orders]);

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage; /* = 1 * 5 = 5 */
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage; /* =  5 - 5 = 0*/
  const currentOrders = filteredOders.slice(indexOfFirstOrder, indexOfLastOrder);
  const [activeFilter, setActiveFilter] = useState("all"); // Default: show all

  const [selectedOrderItems, setSelectedOrderItems] = useState<selectedOrderItemProp[] | null>(null);

  async function showOrderDetails(orderItem:OrderWithUser){
    setSelectedOrder(orderItem);
    try {
      const res = await fetch(`/api/orders/${orderItem.order.cart_id}`);
      if (!res.ok) throw new Error("Failed to fetch product");

      const orderItems: selectedOrderItemProp[] = await res.json();
      
      setSelectedOrderItems(orderItems);

    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }

  function calculateTotalePrice(){
    if(selectedOrderItems){
      let totalePrice = 0;
      selectedOrderItems.map((selectedOrderItem) => {
        totalePrice += selectedOrderItem.quantity * selectedOrderItem.product.price;
      });

      return totalePrice;
    }
  }

  function changeStatus(selectedOrd:OrderWithUser){
    
    const orderIndex = orders.findIndex((orderElemnts:OrderWithUser) => orderElemnts.order.cart_id == selectedOrd.order.cart_id);

    changeOrderStatus(orderIndex);
  }

   // Filtering orders based on selected tab
   const filterOrders = (status: string) => {
    setActiveFilter(status);

    if (status === "all") {
        setFilteredOders(orders);
    } else if (status === "clientValidated") {
        setFilteredOders(orders.filter((order: OrderWithUser) => order.order.client_status === 1 && order.order.admin_status === 0));
    } else if (status === "adminValidated") {
        setFilteredOders(orders.filter((order: OrderWithUser) => order.order.client_status === 0 && order.order.admin_status === 1));
    } else if (status === "fullyValidated") {
        setFilteredOders(orders.filter((order: OrderWithUser) => order.order.client_status === 1 && order.order.admin_status === 1));
    } else if (status === "notValidated") {
        setFilteredOders(orders.filter((order: OrderWithUser) => order.order.client_status === 0 && order.order.admin_status === 0));
    }
  };

  return (
    <div className="orders-presentation">
      {/* Tabs for Categories */}
      <div className="table-header-presentation">
        <div className="d-flex justify-content-end mb-3">
          <select
            className="form-select w-auto"
            value={ordersPerPage}
            onChange={(e) => {
              setOrdersPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </div>
      </div>

      {/* Tabs for Validation Status */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeFilter === "all" ? "active" : ""}`} onClick={() => filterOrders("all")}>
            All Orders
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeFilter === "fullyValidated" ? "active" : ""}`} onClick={() => filterOrders("fullyValidated")}>
            ✅ Validated by Client & Admin
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeFilter === "clientValidated" ? "active" : ""}`} onClick={() => filterOrders("clientValidated")}>
            🔵 Validated by Client, Not by Admin
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeFilter === "adminValidated" ? "active" : ""}`} onClick={() => filterOrders("adminValidated")}>
            🟡 Validated by Admin, Not by Client
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeFilter === "notValidated" ? "active" : ""}`} onClick={() => filterOrders("notValidated")}>
            ❌ Not Validated by Client & Admin
          </button>
        </li>
      </ul>

      {/* Products Table */}
      <table className="table table-striped table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Username</th>
            <th>client status</th>
            <th>admin status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((orderItem:OrderWithUser) => (
              <tr key={orderItem.order.cart_id}>
                <td>
                    {orderItem.user.username}
                </td>
                <td>{orderItem.order.client_status == 1  ? <p className="green-color">valider</p> : <p className="red-color">pas encore calider</p>}</td>
                <td>{orderItem.order.admin_status == 1  ? <p className="green-color">valider</p> : <p className="red-color">pas encore calider</p>}</td>
                <td>{new Date(orderItem.order.date_cart).toLocaleDateString()}</td>
                <td>
                  <div className="table-action">
                    <button 
                        className="btn btn-info btn-sm me-2"
                        onClick={() => showOrderDetails(orderItem)}
                    >
                      <i className="fa fa-eye"></i>
                    </button>
                    <Link href={`/admin/edit-order/${orderItem.order.cart_id}`} className="btn btn-warning btn-sm me-2">
                      <i className="fa fa-edit"></i>
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      data-bs-toggle="modal" 
                      data-bs-target="#orderDetailsModal"
                      onClick={() => setSelectedOrder(orderItem)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
                No products available in this category.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination */}
      {filteredOders.length > ordersPerPage && (
        <nav>
          <ul className="pagination justify-content-center">
            {/* First Page Button */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                &laquo;&laquo;
              </button>
            </li>

            {/* Previous Page Button */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                &lt;
              </button>
            </li>

            {/* Page Numbers */}
            {(() => {
              const totalPages = Math.ceil(filteredOders.length / ordersPerPage);
              const maxPagesToShow = 3; // Number of page numbers to show at a time
              const pages = [];

              let startPage = Math.max(1, currentPage - 1);
              let endPage = Math.min(totalPages, currentPage + 1);
            
              if (currentPage === 1) {
                endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
              } else if (currentPage === totalPages) {
                startPage = Math.max(1, totalPages - maxPagesToShow + 1);
              }
            
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i)}>
                      {i}
                    </button>
                  </li>
                );
              }
            
              if (startPage > 1) {
                pages.unshift(
                  <li key="dots-start" className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                );
              }
            
              if (endPage < totalPages) {
                pages.push(
                  <li key="dots-end" className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                );
              }
            
              return pages;
            })()}

            {/* Next Page Button */}
            <li className={`page-item ${currentPage === Math.ceil(filteredOders.length / ordersPerPage) ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredOders.length / ordersPerPage)}
              >
                &gt;
              </button>
            </li>
          
            {/* Last Page Button */}
            <li className={`page-item ${currentPage === Math.ceil(filteredOders.length / ordersPerPage) ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(Math.ceil(filteredOders.length / ordersPerPage))}
                disabled={currentPage === Math.ceil(filteredOders.length / ordersPerPage)}
              >
                &raquo;&raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Bootstrap Delete Confirmation Modal */}
      {/*
      <div
        className="modal fade"
        id="deleteModal"
        tabIndex={-1}
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedOrder ? (
                <p>Are you sure you want to delete <strong>{selectedOrder.order.cart_id}</strong>?</p>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                No
              </button>
              <button type="button" className="btn btn-danger">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      */}
      <div
          className="modal fade"
          id="orderDetailsModal"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
      >
      {selectedOrder && (
        <div className="modal-dialog" style={{maxWidth: '70vw'}}>
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Order Details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {setSelectedOrderItems(null); setSelectedOrder(null); }}
              ></button>
            </div>
            <div className="modal-header-2">
              <div className="modal-validation-actions">
                {selectedOrder.order.client_status === 0 && (
                  <div className="modal-validation-action modal-client-validation-action">
                    <button type="button" className="btn btn-primary">
                      <i className="fa-regular fa-circle-check"></i>
                      Valider client
                    </button>
                  </div>
                )}
                {selectedOrder.order.admin_status === 0 && (
                  <div className="modal-validation-action modal-client-validation-action">
                    <button type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      aria-label="Close" 
                      onClick={() => {
                          setSelectedOrderItems(null); 
                          setSelectedOrder(null); 
                          changeStatus(selectedOrder);}
                      }> 
                      <i className="fa-regular fa-circle-check"></i>
                      Valider admin
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-body">
                  {
                    !selectedOrderItems ? (
                      <div className='loading-div'>
                        <Spinner animation="border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </div>
                    ) : (
                      <div className="order-items-details">
                        
                        <table className="table table-striped table-bordered mt-3">
                          <thead className="table-dark">
                            <tr>
                              <th>Image</th>
                              <th>Product Name</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>Totale Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              selectedOrderItems.map((selectedOrderItem:selectedOrderItemProp) => (
                                <tr key={selectedOrderItem.product.product_id}>
                                  <td>
                                    <img src={`data:image/png;base64,${selectedOrderItem.product.images?.[0]?.image || ""}`} 
                                         alt={selectedOrderItem.product.product_name} 
                                         className="product-img" 
                                    />
                                  </td>
                                  <td>{selectedOrderItem.product.product_name}</td>
                                  <td>{selectedOrderItem.product.price}</td>
                                  <td>{selectedOrderItem.quantity}</td>
                                  <td>{selectedOrderItem.quantity * selectedOrderItem.product.price}</td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                        <p>
                          Totale price = {calculateTotalePrice()}
                        </p>
                      </div>
                    )
                  }
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {setSelectedOrderItems(null); setSelectedOrder(null); }}
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">Change order</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
