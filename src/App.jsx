import { useState } from "react";

import Header from "./components/Header.jsx";
import Product from "./components/Product.jsx";
import Shop from "./components/Shop.jsx";
import { DUMMY_PRODUCTS } from "./dummy-products.js";
import { CartContext } from "./store/shopping-cart-context.jsx";

function App() {
    const [shoppingCart, setShoppingCart] = useState({
        items: [],
    });

    function handleAddItemToCart(id) {
        setShoppingCart((prevShoppingCart) => {
            const updatedItems = [...prevShoppingCart.items];

            const existingCartItemIndex = updatedItems.findIndex((cartItem) => cartItem.id === id);
            const existingCartItem = updatedItems[existingCartItemIndex];

            if (existingCartItem) {
                const updatedItem = {
                    ...existingCartItem,
                    quantity: existingCartItem.quantity + 1,
                };
                updatedItems[existingCartItemIndex] = updatedItem;
            } else {
                const product = DUMMY_PRODUCTS.find((product) => product.id === id);
                updatedItems.push({
                    id: id,
                    name: product.title,
                    price: product.price,
                    quantity: 1,
                });
            }

            return {
                items: updatedItems,
            };
        });
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        setShoppingCart((prevShoppingCart) => {
            const updatedItems = [...prevShoppingCart.items];
            const updatedItemIndex = updatedItems.findIndex((item) => item.id === productId);

            const updatedItem = {
                ...updatedItems[updatedItemIndex],
            };

            updatedItem.quantity += amount;

            if (updatedItem.quantity <= 0) {
                updatedItems.splice(updatedItemIndex, 1);
            } else {
                updatedItems[updatedItemIndex] = updatedItem;
            }

            return {
                items: updatedItems,
            };
        });
    }

    return (
        // NOTE: you can use nested property values as components if those values are valid React
        //       components like the Provider property!
        //
        // NOTE: you need to add a "value=" property in <CartContext.Provider>
        //       The default value set when creating the context is only used if a component that was not wrapped by the Provider
        //       component triex to access the context value
        <CartContext.Provider value={{ items: [] }}>
            <Header cart={shoppingCart} onUpdateCartItemQuantity={handleUpdateCartItemQuantity} />
            {/*
                Component Composition refers to the process of combining smaller,
                reusable components together to create larger, more complex components

                Component Composition gets rid of parts of the prop drilling problem, but the downside is that we don't want to use
                this for all of our component layers, because then all of our components would end up in the app component and all
                other components are just wrapper components
            */}
            <Shop>
                {DUMMY_PRODUCTS.map((product) => (
                    <li key={product.id}>
                        <Product {...product} onAddToCart={handleAddItemToCart} />
                    </li>
                ))}
            </Shop>
        </CartContext.Provider>
    );
}

export default App;
