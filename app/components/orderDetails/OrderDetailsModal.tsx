import React from "react";

const OrderDetailsModal: React.FC<any> = ({ selectedOrder, onClose }) => {
  return (
    <div
      className="modal fade"
      id="orderDetailsModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      key={selectedOrder?.order.cart_id || "default"}
    >
      {selectedOrder && (
        <div className="modal-dialog">
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
                onClick={onClose}
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
                    <button type="button" className="btn btn-primary">
                      <i className="fa-regular fa-circle-check"></i>
                      Valider admin
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-body">
              <p>Order ID: {selectedOrder.order.cart_id}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsModal;
