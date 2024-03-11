import { CartContext } from "../store/shopping-cart-context";

export default function Cart({ onUpdateItemQuantity }) {
    return (
        /*
            <CartContext.Consumer> is another way to get context in a component by wrapping JSX code
            that should have access to a context value with it

            NOTE: this is NOT the standard way! This is more cumbersome and harder to read. Therefore,
                  useContext is the standard way to get Context
        */
        <CartContext.Consumer>
            {
                /*
                    The Consumer component needs a special type of child/content/function that's passed between its
                    opening and closing tags!

                    This function, under the hood, will be executed by React! The function automatically receives
                    the CartContext as a parameter and the function should return the actual JSX code that should
                    be output by that component

                    This function is essentially an extra wrapper that's required by that Consumer component, to
                    make that consumed context 
                */
                (cartContext) => {
                    const { items } = cartContext;
                    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
                    const formattedTotalPrice = `$${totalPrice.toFixed(2)}`;

                    return (
                        <div id="cart">
                            {items.length === 0 && <p>No items in cart!</p>}
                            {items.length > 0 && (
                                <ul id="cart-items">
                                    {items.map((item) => {
                                        const formattedPrice = `$${item.price.toFixed(2)}`;

                                        return (
                                            <li key={item.id}>
                                                <div>
                                                    <span>{item.name}</span>
                                                    <span> ({formattedPrice})</span>
                                                </div>
                                                <div className="cart-item-actions">
                                                    <button onClick={() => onUpdateItemQuantity(item.id, -1)}>-</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => onUpdateItemQuantity(item.id, 1)}>+</button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                            <p id="cart-total-price">
                                Cart Total: <strong>{formattedTotalPrice}</strong>
                            </p>
                        </div>
                    );
                }
            }
        </CartContext.Consumer>
    );
}
