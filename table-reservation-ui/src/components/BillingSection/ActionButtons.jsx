"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSave, FaPrint, FaFileInvoice, FaPause } from "react-icons/fa"
import generateBillPdf from "../../utils/generateBillPdf"

const ActionButtons = ({ 
  cart, 
  grandTotal, 
  paymentMethod, 
  setPdfUrl, 
  pdfUrl, 
  tableNumber, 
  peopleCount, 
  customerDetails,
  orderType,
}) => {
  const [isPrinted, setIsPrinted] = useState(false)
  const [settlementAmount, setSettlementAmount] = useState("")
  const navigate = useNavigate()

  const TAX_RATE = 0.05; // 5% tax

  const saveOrder = async () => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * TAX_RATE;
  const discount = subtotal + tax - grandTotal;

  const customerData = {
    name: customerDetails?.name || "",
    phone: customerDetails?.phone || "",
    address: customerDetails?.address || "",
  };

  const response = await fetch("http://localhost:5002/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order_type: orderType,
      table_info: tableNumber,
      people_count: peopleCount,
      customer: customerData,
      payment_type: paymentMethod,
      subtotal,
      tax,
      discount,
      grand_total: grandTotal,
      items: cart,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text(); // Get error details
    throw new Error(`Server Error: ${response.status} - ${errorText}`);
  }

  return response.json(); // Only parse JSON if response is OK
};



  // 🔹 Save & Print
  const handleSaveAndPrint = async () => {
    try {
      const result = await saveOrder()
      if (result.success) {
        alert("Order saved. Printing...")

        // Generate and print the bill
        generateBillPdf(cart, grandTotal, paymentMethod, orderType, setPdfUrl)

        setTimeout(() => {
          if (pdfUrl) {
            const iframe = document.createElement("iframe")
            iframe.src = pdfUrl
            iframe.style.display = "none"
            document.body.appendChild(iframe)
            iframe.contentWindow.print()
          }
          setIsPrinted(true)
        }, 500) // Allow time for PDF URL to be updated
      } else {
        alert("Failed to save order.")
      }
    } catch (err) {
      console.error("Error saving and printing:", err)
      alert("Something went wrong.")
    }
  }

  // 🔹 Save Only
  const handleSaveOnly = async () => {
    try {
      const result = await saveOrder()
      if (result.success) {
        alert("Order saved successfully.")
      } else {
        alert("Failed to save order.")
      }
    } catch (err) {
      console.error("Error saving order:", err)
      alert("Something went wrong while saving the order.")
    }
  }

  // 🔹 Settle & Save (after print)
  const handleSettlement = () => {
    if (!settlementAmount || isNaN(settlementAmount)) {
      alert("Please enter a valid amount.")
      return
    }
    alert(`Settled ₹${settlementAmount} and order marked complete.`)
    // You can send this to your backend if needed
  }

  // 🔹 KOT Handler
  const handleKOT = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/kots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_no: tableNumber,
          items: cart,
          amount: grandTotal,
          kot_time: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("KOT creation failed:", errorText);
        throw new Error("Failed to save KOT");
      }

      // 2. Optionally update table status (if not handled in backend)
      await fetch(`http://localhost:5002/api/tables/${tableNumber}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "KOT" }),
      })

      // 3. Redirect to HomeScreen
      navigate("/")
    } catch (err) {
      alert("Failed to create KOT")
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col space-y-2 text-xs">

      {/* 🔹 Show Settlement First if Printed */}
      {isPrinted && (
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Enter Settlement Amount"
            value={settlementAmount}
            onChange={(e) => setSettlementAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
          <button
            onClick={handleSettlement}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Settle & Save
          </button>
        </div>
      )}

      {/* 🔹 Save & Print Buttons */}
      <div className="flex justify-between items-center space-x-2">
        <button onClick={handleSaveOnly} className="flex items-center justify-center bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 flex-1">
          <FaSave className="mr-1" /> Save
        </button>

        <button onClick={handleSaveAndPrint} className="flex items-center justify-center bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 flex-1">
          <FaPrint className="mr-1" /> Save & Print
        </button>

        <button className="flex items-center justify-center bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 flex-1">
          <FaFileInvoice className="mr-1" /> eBill
        </button>

        <button className="flex items-center justify-center bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 flex-1">
          <FaPause className="mr-1" /> Hold
        </button>
      </div>

      {/* 🔹 KOT Buttons Below */}
      <div className="flex justify-between items-center space-x-2 pt-2">
        <button
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 flex-1"
          onClick={handleKOT}
        >
          KOT
        </button>
        <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 flex-1">
          KOT & Print
        </button>
      </div>
    </div>
  )

}

export default ActionButtons
