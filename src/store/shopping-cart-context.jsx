import { createContext, useReducer, useState } from "react";
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
export const CartContext = createContext({
    items: [],
    addItemToCart: () => {},
    updateCartItemQuantity: () => {},
});

/*
    The Reducer function should NOT be recreated when the component function executes! Because it doesn't need
    direct access to any value defined or updated in the component function

    It won't need access to props or anything defined/updated in the component function. Therefore, it can be
    defined outside the function

    The reducer function accepts two parameters: (1) state, (2) action

    This reducer function will be called by React after you dispatch a so-called action

    The action you will dispatch with the dispatch function (shoppingCartDispatch) will
    be the action you'll receive on the second parameter

    The state in the first parameter, will be the guranteed latest state snapshot of that state (just like prevShoppingCart!) that is managed
    by the useReducer! React ensures that you get the latest state as the first argument in the reducer function

    In the shoppingCartReducer function, you return the updated state!

    NOTE!!!!
    You can use the useReducer Hook in other components as well, and it's NOT connected to this context feature!
    However, they are often used in conjunction, but they work independently from each other!

    You can use useReducer in any React component that needs state!
*/
const shoppingCartReducer = (state, action) => {
    if (action.type === "ADD_ITEM") {
        // We don't use "prevShoppingCart" we use "state"!
        // RECALL: "state" is the latest state we're getting from React
        const updatedItems = [...state.items];
        const existingCartItemIndex = updatedItems.findIndex((cartItem) => cartItem.id === action.payload);
        const existingCartItem = updatedItems[existingCartItemIndex];
        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
            updatedItems.push({
                id: action.payload,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
        }

        // We're returning the updated state snapshot
        return {
            ...state, // Note, this is getting all the other properties of the state
            items: updatedItems, // this is the updated property
        };
    }

    if (action.type === "UPDATE_ITEM") {
        const updatedItems = [...state.items];
        const updatedItemIndex = updatedItems.findIndex((item) => item.id === action.payload.productId);

        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };

        updatedItem.quantity += action.payload.amount;

        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }

        return {
            ...state,
            items: updatedItems,
        };
    }

    return state;
};

// We can create a component function in shopping-cart-context.jsx to get all the context-related data management
// out of the App component (to make it less bloated) into a seperate context component
export default function CartContextProvider({ children }) {
    // You pass in a pointer to the reducer function into useReducer as a FIRST argument
    // Now the reducer function is registered for React and will be executed whenever you dispatch
    //
    // Often, you might want to pass in a second value to set the inital value of the state in the
    // reducer function, which will be used if the state has never been updated yet!
    // (this is equivalent to initalizing in useState)
    //
    // Now we can use the shoppingCartState value in useReducer instead of shoppingCart in useState
    // This value is the "state" parameter in shoppingCartReducer
    const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, { items: [] });

    // useState is not needed because we're using useReducer
    // const [shoppingCart, setShoppingCart] = useState({
    //     items: [],
    // });

    function handleAddItemToCart(id) {
        // We use shoppingCartDispath to dispatch an action
        //
        // The action can be anything you want! It can be a string, a number, but in most cases, it's an object that has a property
        // of "type" or "identifier", so that you can tell different actions apart from each other and handle them differently
        // inside of your reducer
        //
        // The action has some data attached to it that will be required to perform the action! In this case, the id of the product
        // that should be added to the cart
        //
        // Therefore, we'll add a second property to the object (which is OFTEN called "payload", but it could be called id or anything else)
        // and in this case, the payload property holds the id
        //
        // With this action dispatched here, we can go back to the Reducer function, it will get executed and it will get the "ADD_ITEM" action
        //
        // NOTE:
        // Basically, shoppingCartDispatch takes in an action, which is an object in most cases, and pass it into the shoppingCartReducer function
        // as the second parameter
        shoppingCartDispatch({
            type: "ADD_ITEM",
            payload: id,
        });
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        // Now the payload consists of 2 values!
        shoppingCartDispatch({
            type: "UPDATE_ITEM",
            payload: {
                productId,
                amount,
            },
        });
    }

    const contextValue = {
        items: shoppingCartState.items,
        addItemToCart: handleAddItemToCart,
        updateCartItemQuantity: handleUpdateCartItemQuantity,
    };

    return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}
