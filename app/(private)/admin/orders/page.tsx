'use client'

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/redux/store";
import { setOrders, updateOrderStatusByOrderIndex } from "@/redux/slices/orderSlice";
import Table from "../../../components/table/Table";



export default function OrdersPage() {

    const dispatch = useDispatch();
    
    const ordersList = useSelector((state: RootState) => state.orders.items);

    function changeOrderAdminStatus(orderIndex: number){
      console.log("orderIndex");
      dispatch(updateOrderStatusByOrderIndex({ index: orderIndex }));
      
      // ✅ Save in Local Storage for future use
      localStorage.setItem("orders", JSON.stringify(ordersList));

    }

    useEffect(() => {
      const loadData = async () => {
        let orders:typeof ordersList = ordersList

        if(orders.length == 0){
          const cachedOrders = localStorage.getItem('orders');
          if(cachedOrders && cachedOrders.length > 0){
            orders = JSON.parse(cachedOrders);
            console.log("Loaded from Local Storage");

            // ✅ Restore to Redux
            dispatch(setOrders(orders));
          }
        }

        if(orders.length == 0){
          console.log("Fetching from API...");
          try {
            const ordersResponse = await fetch("/api/orders");
            orders = await ordersResponse.json();

            console.log('orders from orders page');
            console.log(orders);
  
            // ✅ Save in Redux
            dispatch(setOrders(orders));
  
            // ✅ Save in Local Storage for future use
            localStorage.setItem("orders", JSON.stringify(orders));
          } catch (error) {
            console.error("Failed to fetch data:", error);
          }
        }
      }
      loadData();
      console.log(ordersList);
    }, [ordersList]);


    return (
      <main id="orders-page">
        <div className="container orders-container">
          {
            ordersList ? (
                <Table orders={ordersList} changeOrderStatus={changeOrderAdminStatus}/>
            ) : (
              <h1>
                Wait
              </h1>
            )
          }
        </div>
      </main>
    );
  }
  