import React, {useState, useEffect, useCallback, useMemo, useRef} from "react";
import cartIcon from "../../icons/cart.svg";
import removeIcon from "../../icons/remove.svg";
import creditCardIcon from "../../icons/creditcard.svg";
import paypalIcon from "../../icons/paypal.svg";
import googlePayIcon from "../../icons/googlepay.svg";
import applePayIcon from "../../icons/applepay.svg";

import PaymentModal from "./PaymentModal";
import PaymentConfirmModal from "./PaymentConfirmModal";
import "./Cart.css"

// Memoized Cart Item Component
// CartItem component with proper display name
function CartItem({ item, onUpdateQuantity, onRemove }) {
    const handleDecrement = useCallback(() => onUpdateQuantity(item._id, -1), [item._id, onUpdateQuantity]);
    const handleIncrement = useCallback(() => onUpdateQuantity(item._id, 1), [item._id, onUpdateQuantity]);
    const handleRemoveClick = useCallback(() => onRemove(item._id), [item._id, onRemove]);
    
    return (
        <li className="productListItem" key={item._id}>
            <div className="cartProductCtnr">
                <img src={item.product.image} alt={item.product.name} width="50" height="50"/>
                <div className="cartProductName">
                    <h4>{item.product.name}</h4>
                    <p>{item.product.category}</p>
                </div>
            </div>
            <div className="buttonCtnr">
                <button onClick={handleDecrement} className="quantityBtn">-</button>
                <span className="quantityDisplay">{item.quantity}</span>
                <button onClick={handleIncrement} className="quantityBtn">+</button>
            </div>
            <div className="priceDisplay">
                <p>Price: ${item.product.price * item.quantity}</p>
            </div>
            <button onClick={handleRemoveClick} className="removeBtn">
                <img src={removeIcon} alt="Remove Item" width="30" height="30"/>
            </button>
        </li>
    );
}

const MemoizedCartItem = React.memo(CartItem);

const Cart = () =>{
    const [cartItems, setCartItems] = useState([]);
    const [summaryDetails, setSummaryDetails] = useState({totalItems: 0, totalPrice: 0});
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayementMethod, setSelectedPaymentMethod] = useState(null);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const cartItemsRef = useRef(cartItems);

    const fetchCartItems = async () => {
        console.log("Fetching cart items...");
        fetch("http://localhost:5000/api/v1/cart/cartitems")
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const resData = await response.json();
                return resData
            })
            .then((data) => {
                console.log("Raw API response:", data);
                const items = data.cart.items
                setSummaryDetails({
                    totalItems: data.totalNoOfItems,
                    totalPrice: data.totalPrice
                });
                console.log("Processed items:", items);
                setCartItems(items);
            })
            .catch((error) => {
                console.error("Error fetching cart items:", error);
                setCartItems([]);
            });
    };

    useEffect(() => {
        // Fetch cart items on component mount
        fetchCartItems();

        // Listen for storage changes
        const handleStorageChange = (event) => {
            if (event.key === "cartUpdated") {
                console.log("Storage event detected, fetching updated cart");
                fetchCartItems();
            }
        };

        // Listen for custom events
        const handleCustomEvent = () => {
            console.log("Custom event detected, fetching updated cart");
            fetchCartItems();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("cartUpdated", handleCustomEvent);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("cartUpdated", handleCustomEvent);
        };
    }, []);

    // Keep ref in sync with cartItems
    useEffect(() => {
        cartItemsRef.current = cartItems;
    }, [cartItems]);

    const handleUpdateQuantity = useCallback(async(itemId, delta) => {
        const item = cartItemsRef.current.find((item) => item._id === itemId);
        if (!item) return;
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1){
            await handleRemove(itemId);
            return;
        };
        fetch(`http://localhost:5000/api/v1/cart/cartitems/${itemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: newQuantity }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            fetchCartItems();
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { itemId, quantity: newQuantity } }));
            // Set localStorage for cross-tab communication
            localStorage.setItem("cartUpdated", Date.now().toString());
        })
        .catch((error) => console.error("Error updating item quantity:", error));
    }, []);
    const handleRemove = useCallback((itemId) => {
        fetch(`http://localhost:5000/api/v1/cart/cartitems/${itemId}`, {
            method: "DELETE",
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            fetchCartItems();
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { itemId, quantity: 0 } }));
            // Set localStorage for cross-tab communication
            localStorage.setItem("cartUpdated", Date.now().toString());
        })
        .catch((error) => console.error("Error removing item from cart:", error));
    }, []);

    const handleCheckout = useCallback(() => {
        setShowPaymentModal(true);
    }, []);

    const handlePayment = useCallback(() => {
        if (!selectedPayementMethod) {
            alert("Please select a payment method.");
            return;
        }
        setPaymentConfirmed(true);
        setShowPaymentModal(false);
        // Here you can also clear the cart or perform other actions post-payment
    }, [selectedPayementMethod]);

    // Memoize summaryDetails to prevent PaymentConfirmModal re-renders
    const memoizedSummaryDetails = useMemo(() => summaryDetails, [summaryDetails.totalItems, summaryDetails.totalPrice]);

    const handlePaymentDone = useCallback(() => {
        setPaymentConfirmed(false);
         fetch(`http://localhost:5000/api/v1/cart/cartitems`, {
            method: "DELETE",
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            fetchCartItems();
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent("cartUpdated"));
            // Set localStorage for cross-tab communication
            localStorage.setItem("cartUpdated", Date.now().toString());
        })
        .catch((error) => console.error("Error clearing cart after payment:", error)); 
    }, []);
    const paymentoptions = useMemo(() => [
        {id : "credit-card", name: "Credit Card", icon : creditCardIcon, description: "Visa, MasterCard, American Express"},
        {id : "paypal", name: "PayPal", icon : paypalIcon, description: "Pay easily using your PayPal account"},
        {id : "google-pay", name: "Google Pay", icon : googlePayIcon, description: "Fast checkout with Google Pay"},
        {id : "apple-pay", name: "Apple Pay", icon : applePayIcon, description: "Secure payment via Apple Pay"},
    ], []);
    return(
        <div className="cartMain">
            <div className="cartHeader">
                <h1>Shopping Cart</h1>
                <img src={cartIcon} alt="Cart Icon" width="40" height="40"/>
            </div>
            <hr/>
            <div className="cartSectionCtnr">
                <ul className="productListItemCtnr">
                    {cartItems.map((item) => (
                        <MemoizedCartItem 
                            key={item._id} 
                            item={item}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={handleRemove}
                        />
                    ))}
                </ul>

                {cartItems.length > 0 ? (<div className="cartSummaryCtnr">
                    <h3>Order Summary</h3>
                    <p>Total Items: {cartItems.length}</p>
                    <p>Total Price: ${summaryDetails.totalPrice}</p>
                    <p>Items in total: {summaryDetails.totalItems}</p>
                    <button onClick={handleCheckout} className="checkoutBtn">Proceed to Checkout</button>
                </div>) : (<h1 className="emptyCartMsg">Your cart is empty.</h1>)}
            </div>

            <PaymentModal
                showPaymentModal={showPaymentModal}
                setShowPaymentModal={setShowPaymentModal}
                summaryDetails={memoizedSummaryDetails}
                selectedPayementMethod={selectedPayementMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                handlePayment={handlePayment}
                paymentoptions={paymentoptions}
            />
            <PaymentConfirmModal
                showPaymentConfirmModal={paymentConfirmed}
                setShowPaymentConfirmModal={setPaymentConfirmed}
                handlePaymentConfirmation={handlePaymentDone}
                summaryDetails={memoizedSummaryDetails}
                paymentMethod={selectedPayementMethod}
            />

        </div>
        );
};

export default Cart;