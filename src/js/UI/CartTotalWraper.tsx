import styled from "styled-components";

const CartTotalWrapper = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.125);
  
  .btn {
    width: 100%;
    text-transform: uppercase;
  }

  p.card-text {
    line-height: 1.25;
  }

  .cart-total-total {
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

export default CartTotalWrapper;
