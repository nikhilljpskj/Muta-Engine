import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import TopNavBar from '../components/TopNavbar';
import LeftNavBar from '../components/LeftSidebar';
import './ViewOrder.scss';

const ViewOrders = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders');
        setRentals(response.data);
      } catch (error) {
        setError('Error fetching orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const generatePDF = (rental) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Tax Invoice', 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text('Rent By: MutaEngine Rental', 14, 30);
    doc.text('Ship-from Address: ABC Buildings, ', 14, 36);
    doc.text('Pathanamthitta, Kerala, 691555, IN-KL', 14, 42);
    doc.text('GSTIN - 9876543210', 14, 48);

    doc.setFontSize(12);
    doc.text(`Invoice Number: #INV-${rental.id}`, 140, 30);
    doc.text(`Order ID: ${rental.id}`, 14, 60);
    doc.text(`Order Date: ${new Date(rental.created_at).toLocaleDateString()}`, 14, 66);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 72);
    doc.text(`PAN: CYIIH5678P`, 14, 78);

    doc.text('Bill To:', 14, 90);
    doc.text(`${rental.user_name}`, 14, 96);
    doc.text(`${rental.address}`, 14, 102);
    doc.text('Kerala', 14, 108);
    doc.text(`Phone: ${rental.contact}`, 14, 114);

    doc.text('Ship To:', 105, 90);
    doc.text(`${rental.user_name}`, 105, 96);
    doc.text(`${rental.delivery_address}`, 105, 102);
    doc.text('Kerala', 105, 108);
    doc.text(`Phone: ${rental.contact}`, 105, 114);

    const totalPrice = parseFloat(rental.total_price || 0);
    const totalPriceGST = parseFloat(rental.total_price_gst || 0);

    doc.autoTable({
      startY: 130,
      head: [['Product', 'Qty', 'Amount', 'GST ', 'Taxable Value', 'Days', 'Total']],
      body: [
        [
          rental.product_name,
          rental.quantity,
          totalPrice.toFixed(2),
          '18%',
          totalPriceGST.toFixed(2),
          rental.no_of_days,
          (totalPrice + totalPriceGST).toFixed(2)
        ]
      ],
      theme: 'grid',
    });

    const finalY = doc.lastAutoTable.finalY;
    doc.text('Grand Total : ' + (totalPrice + totalPriceGST).toFixed(2), 14, finalY + 10);
    doc.text('Authorized Signatory', 14, finalY + 30);
    doc.text('MutaEngine Rental', 14, finalY + 40);

    doc.save(`Invoice_${rental.id}.pdf`);
  };

  return (
    <>
      <TopNavBar />
      <div className="order-details-page">
        <LeftNavBar />
        <div className="order-details content">
          <h1>Your Orders</h1>
          {loading && <p>Loading orders...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <table className="order-table">
              <thead>
                <tr>
                  <th className='column-field-contact'>Product</th>
                  <th className='column-field-contact'>Contact</th>
                  <th className='column-field-contact'>Start Date</th>
                  <th className='column-field-contact'>End Date</th>
                  <th className='column-field'>Days</th>
                  <th className='column-field'>Qty</th>
                  <th hidden>Total Price</th>
                  <th hidden>Total Price with GST</th>
                  <th className='column-field-contact'>Total</th>
                  <th hidden>Delivery Address</th>
                  <th hidden>Email</th>
                  <th className='column-field-contact'>Status</th>
                  <th>Action</th>
                  <th hidden>Created At</th>
                </tr>
              </thead>
              <tbody>
                {rentals.length > 0 ? (
                  rentals.map((rental) => (
                    <tr key={rental.id}>
                      <td className='column-field-contact'>{rental.product_name}</td>
                      <td className='column-field-contact'>{rental.contact}</td>
                      <td className='column-field-contact'>{new Date(rental.start_date).toLocaleDateString()}</td>
                      <td>{new Date(rental.end_date).toLocaleDateString()}</td>
                      <td>{rental.no_of_days}</td>
                      <td>{rental.quantity}</td>
                      <td hidden>${rental.total_price}</td>
                      <td hidden>${rental.total_price_gst}</td>
                      <td>${(parseFloat(rental.total_price || 0) + parseFloat(rental.total_price_gst || 0)).toFixed(2)}</td>
                      <td hidden>{rental.delivery_address}</td>
                      <td hidden>{rental.email}</td>
                      <td className='column-field-contact'>{rental.status === 1 ? 'Paid' : 'Inactive'}</td>
                      <td>
                        <button onClick={() => generatePDF(rental)} aria-label={`Print invoice for ${rental.product_name}`}>
                          Print Invoice
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewOrders;
