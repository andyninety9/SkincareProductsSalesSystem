import React from "react";
import "./card.scss";
import { Rate } from "antd";

export default function CardProduct({ product }) {
  return (
    <div className="cardProduct">
      <img src={product?.img} alt="" />

      <div className="cardProduct-content">
        <div className="cardProduct-content-left">
          <Rate defaultValue={3} className="cardProduct-content-left-rate" />
          <p style={{ fontWeight: 500, fontSize: "14px" }}>{product?.name}</p>
          <p>{product?.desc}</p>
        </div>

        <div className="cardProduct-content-right">$ {product?.price}</div>
      </div>
    </div>
  );
}

