import { createContext, useState } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products.js";

// You can pass a value in createContext that will be used as an initial value
// that can be provided to multiple components
//
// The value provided to components via this context feature can be by value
// you want! (Number, String, Object, or Array)

// Why is setting this default value here useful even though we need to pass in "value=" in <CartContext.Provider>?
//
// By setting the default value, we get better auto completion! When you get the value in CartContext, like:
// const cartContext = useContext(CartContext) --> "cartContext.items" shows up in the auto completion
//
// While small, it makes your life as a developer easier!
const CartContext = createContext({
    items: [],
    addItemToCart: () => {},
    updateCartItemQuantity: () => {},
});

// We can create a component function in shopping-cart-context.jsx to get all the context-related data management
// out of the App component (to make it less bloated) into a seperate context component
export default function CartContextProvider({ children }) {
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

    const contextValue = {
        items: shoppingCart.items,
        addItemToCart: handleAddItemToCart,
        updateCartItemQuantity: handleUpdateCartItemQuantity,
    };

    return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}
