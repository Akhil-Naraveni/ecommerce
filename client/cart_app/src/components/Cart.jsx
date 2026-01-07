import React, {useState, useEffect} from "react";
import cartIcon from "../../icons/cart.svg";
import removeIcon from "../../icons/remove.svg";
import "./Cart.css"

const Cart = () =>{
    const [cartItems, setCartItems] = useState([]);
    const [summaryDetails, setSummaryDetails] = useState({totalItems: 0, totalPrice: 0});
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayementMethod, setSelectedPaymentMethod] = useState(null);

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

    const handleUpdateQuantity = async(itemId, delta) => {
        const item = cartItems.find((item) => item._id === itemId);
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
    };
    const handleRemove = (itemId) => {
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
    };

    const handleCheckout = () => {
        setShowPaymentModal(true);
    }

    const paymentoptions = [
        {id : "credit-card ", name: "Credit Card", icon : {cartIcon}, description: "Visa, MasterCard, American Express"},
        {id : "paypal", name: "PayPal", icon : {cartIcon}, description: "Pay easily using your PayPal account"},
        {id : "google-pay", name: "Google Pay", icon : {cartIcon}, description: "Fast checkout with Google Pay"},
        {id : "apple-pay", name: "Apple Pay", icon : {cartIcon}, description: "Secure payment via Apple Pay"},
    ];
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
                        <li className="productListItem" key={item._id}>
                            <div className="cartProductCtnr">
                                <img src={item.product.image} alt={item.product.name} width="50" height="50"/>
                                <div className="cartProductName">
                                    <h4>{item.product.name}</h4>
                                    <p>{item.product.category}</p>
                                </div>
                            </div>
                            <div className="buttonCtnr">
                                <button onClick={() => handleUpdateQuantity(item._id, -1)} className="quantityBtn">-</button>
                                <span className="quantityDisplay">{item.quantity}</span>
                                <button onClick={() => handleUpdateQuantity(item._id, 1)} className="quantityBtn">+</button>
                            </div>
                            <div className="priceDisplay">
                                <p>Price: ${item.product.price * item.quantity}</p>
                            </div>
                            <button onClick={() => handleRemove(item._id)} className="removeBtn">
                                <img src={removeIcon} alt="Remove Item" width="30" height="30"/>
                            </button>
                            
                        </li>
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

            {showPaymentModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Select payment method</h3>
                            <span className="close-button">&times;</span>
                        </div>
                        <div className="modal-body">
                            <div className="ordersummary">
                                <h3>Order Summary</h3>
                                <p>Total Items: {cartItems.length}</p>
                                <p>Total Price: ${summaryDetails.totalPrice}</p>
                                <p>Items in total: {summaryDetails.totalItems}</p>
                            </div>
                            <div className="paymentmethodsctnr">
                            <fieldset className="paymentmethodOptions">
                                    {paymentoptions.map((option) => (
                                        <label key={option.id} className={`paymentOptionLabel ${selectedPayementMethod === option.id ? 'selected' : ''}`} htmlFor={`payment-${option.id}`}>
                                            <input
                                            onChange={()=>setSelectedPaymentMethod(option.id)}
                                            checked={selectedPayementMethod === option.id}
                                             type="radio" 
                                             id={`payment-${option.id}`} 
                                             name="paymentMethod" 
                                             value={option.id} 
                                             className="sr-only"/>
                                            <img src={option.icon.cartIcon} alt={`${option.name} Icon`} width="30" height="30"/>
                                            <div className="paymentInfo">
                                                <h4>{option.name}</h4>
                                                <p>{option.description}</p>
                                            </div>
                                            <div className={`radioIndicator ${selectedPayementMethod === option.id ? 'selected' : ''}`}>
                                                
                                            </div>
                                        </label>
                                    ))}
                                </fieldset>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="confirmPaymentBtn">Confirm Payment</button>
                            <button className="cancelPaymentBtn" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                        </div>    
                    </div>
                </div>
            )}
        </div>
        );
};

export default Cart;