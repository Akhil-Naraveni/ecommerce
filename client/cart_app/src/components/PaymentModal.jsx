import React from "react";
import "./Cart.css"
import tickIcon from "../../icons/tick.svg";

const PaymentModal = ({
    showPaymentModal,
    setShowPaymentModal,
    summaryDetails,
    selectedPayementMethod,
    setSelectedPaymentMethod,
    handlePayment,
    paymentoptions,
}) => {
    if (!showPaymentModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Select payment method</h3>
                    <button className="closeModalBtn" onClick={() => setShowPaymentModal(false)}>x</button>
                </div>
                <div className="modal-body">
                    <div className="ordersummary">
                        <h3>Order Summary</h3>
                        <div className="summaryCtnr">
                            <div className="summaryItem">
                                <p>Total Items</p>
                                <span>{summaryDetails.totalItems}</span>
                            </div>
                            <div className="summaryItem">
                                <p>Shipping Fee</p>
                                <p> <span className="feeStrike">$9 </span><span className="free">Free</span></p>
                            </div>
                            <div className="summaryItem">
                                <p>Handling Fee</p>
                                <p> <span className="feeStrike">$9 </span><span className="free">Free</span></p>
                            </div>
                            <div className="summaryItem lastItem">
                                <p>Total Price</p>
                                <span className="totalPrice">$ {summaryDetails.totalPrice}</span>
                            </div>
                        </div>
                    </div>
                    <div className="paymentmethodsctnr">
                        <fieldset className="paymentmethodOptions">
                            {paymentoptions.map((option) => (
                                <label key={option.id} className={`paymentOptionLabel ${selectedPayementMethod === option.id ? 'selected' : ''} ${option.id}`} htmlFor={`payment-${option.id}`}>
                                    <input
                                        onChange={() => setSelectedPaymentMethod(option.id)}
                                        checked={selectedPayementMethod === option.id}
                                        type="radio"
                                        id={`payment-${option.id}`}
                                        name="paymentMethod"
                                        value={option.id}
                                        className="sr-only"
                                    />
                                    <img src={option.icon} alt={`${option.name} Icon`} width="40" height="40" />
                                    <div className="paymentInfo">
                                        <h4>{option.name}</h4>
                                        <p>{option.description}</p>
                                    </div>
                                    <div className={`radioIndicator ${selectedPayementMethod === option.id ? 'selected' : ''}`}>
                                        {selectedPayementMethod === option.id && <img src={tickIcon} alt="Selected" width="30" height="30" />}
                                    </div>
                                </label>
                            ))}
                        </fieldset>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="confirmPaymentBtn" onClick={handlePayment}>Confirm Payment</button>
                    <button className="cancelPaymentBtn" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(PaymentModal);
