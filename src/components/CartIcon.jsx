import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartIcon() {
  const { cartItems } = useCart();

  return (
    <Link to="/cart" className="cart-icon">
      🛒 <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
    </Link>
  );
}

export default CartIcon;