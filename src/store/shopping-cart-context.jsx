import { createContext } from "react";

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
});
