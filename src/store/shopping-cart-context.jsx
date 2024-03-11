import { createContext } from "react";

// You can pass a value in createContext that will be used as an initial value
// that can be provided to multiple components
//
// The value provided to components via this context feature can be by value
// you want! (Number, String, Object, or Array)
export const CartContext = createContext({
    items: [],
});
