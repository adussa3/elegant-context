import Header from "./components/Header.jsx";
import Product from "./components/Product.jsx";
import Shop from "./components/Shop.jsx";
import { DUMMY_PRODUCTS } from "./dummy-products.js";
import CartContextProvider from "./store/shopping-cart-context.jsx";

function App() {
    return (
        // NOTE: you can use nested property values as components if those values are valid React
        //       components like the Provider property!
        //
        // NOTE: you need to add a "value=" property in <CartContext.Provider>
        //       The default value set when creating the context is only used if a component that was not wrapped by the Provider
        //       component tries to access the context value
        <CartContextProvider>
            <Header />
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
                        <Product {...product} />
                    </li>
                ))}
            </Shop>
        </CartContextProvider>
    );
}

export default App;
