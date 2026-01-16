import React, { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import "./Cart.css"
import tickIcon from "../../icons/tick.svg";
import trackIcon from "../../icons/track.svg";


const PaymentConfirmModal = ({
    showPaymentConfirmModal,
    setShowPaymentConfirmModal,
    handlePaymentConfirmation,
    summaryDetails,
    paymentMethod,
}) => {
    const [confetti, setConfetti] = useState(false);
    const [modalDimensions, setModalDimensions] = useState({ width: 0, height: 0 });
    const modalRef = useRef(null);

    useEffect(() => {
        if (showPaymentConfirmModal && modalRef.current) {
            // Get modal dimensions
            const rect = modalRef.current.getBoundingClientRect();
            setModalDimensions({ width: rect.width, height: rect.height });
            
            setConfetti(true);
            // Stop confetti after 5 seconds
            const timer = setTimeout(() => setConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showPaymentConfirmModal]);

    if (!showPaymentConfirmModal) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content paymentConfirmModal" ref={modalRef} style={{ position: 'relative', overflow: 'hidden' }}>
                {confetti && (
                    <Confetti 
                        width={modalDimensions.width} 
                        height={modalDimensions.height}
                        recycle={false}
                    />
                )}
                <div className="modal-body paymentConfirmBody">
                    <div className="paymentSuccessCtnr">
                        <img src={tickIcon} alt="Payment Successful" width="80" height="80"/>
                        <h2>Thank you for your purchase!</h2>
                        <p>Your payment has been processed successfully.</p>
                    </div>

                    <div className="ordersummary">
                        <h3>Payment Details</h3>
                        <div className="summaryCtnr">
                            <div className="summaryItem">
                                <p>Order number</p>
                                <span className="orderId">ORD-12767167</span>
                            </div>
                            <div className="summaryItem">
                                <p>Transaction Id</p>
                                 <span>TXN-286736516778</span>
                            </div>
                            <div className="summaryItem">
                                <p>Payment Method</p>
                                <span>{paymentMethod.toUpperCase()}</span>
                            </div>
                            <div className="summaryItem">
                                <p>Order Date</p>
                                <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}</span>
                            </div>
                            <div className="summaryItem lastItem">
                                <p>Total Paid</p>
                                <span>$ {summaryDetails.totalPrice}</span>
                            </div>
                        </div>
                    </div>

        
                </div>
                <div className="modal-footer">
                    <div className="footerdiv trackinginfo">
                        <div className="trackingHeader">
                        <img src={trackIcon} alt="Track Order" width="30" height="30"/>
                        <p>Track your order in the Orders section - <span className="orderId">OrderId : ORD-12767167</span></p>
                        </div>
                        <p>You will receive an email with tracking details once your order is shipped.</p>
                    </div>
                </div>
                <button onClick={handlePaymentConfirmation} className="doneBtn">Done</button>
            </div>
        </div>
    );
}

export default React.memo(PaymentConfirmModal);