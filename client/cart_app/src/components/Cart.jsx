import React, {useState, useEffect} from "react";

const Cart = () =>{
    const [cartItems, setCartItems] = useState([]);

    const fetchCartItems = () => {
        fetch("http://localhost:5000/api/v1/cart/cartitems")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Raw API response:", data);
                const items = data.cart.items
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
    }, []);

    return(
        <div>
            <h1>Cart Items</h1>
            <ul>
                {cartItems.map((item) => (
                    <li key={item._id}>
                        {item.product.name} - Quantity: {item.quantity}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Cart;