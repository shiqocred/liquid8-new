"use client";

import React, { useRef } from "react";
import Barcode from "react-barcode";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";

interface BarcodePrint {
  oldPrice: string;
  newPrice: string;
  barcode: string;
  category: string;
  isBundle?: boolean;
}

const BarcodePrinted: React.FC<BarcodePrint> = ({
  oldPrice,
  newPrice,
  barcode,
  category,
  isBundle,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <div
        style={{
          width: "7cm",
          height: "4cm",
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          fontFamily: "sans-serif",
        }}
        className="print-container"
        ref={componentRef}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Barcode value={barcode} width={1} height={46} fontSize={12} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 120,
                  height: 43.3,
                }}
              >
                <Image src={"/images/logo-barcode.png"} alt="barcode" fill />
              </div>
              <div
                style={{
                  height: 33,
                  border: "1px solid black",
                  padding: "0px 8px",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <p
                  style={{ fontWeight: "bold", fontSize: 10, lineHeight: 1.2 }}
                >
                  {category}
                </p>
              </div>
            </div>
          </div>
          <div>
            <table style={{ borderSpacing: 0 }}>
              <tr>
                <td
                  style={{ fontSize: 16, fontWeight: "bold", color: "black" }}
                >
                  {!isBundle ? "Harga Retail" : "Total Awal"}
                </td>
                <td
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "black",
                    textDecoration: "line-through",
                  }}
                >
                  : {oldPrice}
                </td>
              </tr>
              <tr>
                <td
                  style={{ fontSize: 16, fontWeight: "bold", color: "black" }}
                >
                  {!isBundle ? "Harga Diskon" : "Custom Display"}
                </td>
                <td
                  style={{ fontSize: 16, fontWeight: "bold", color: "black" }}
                >
                  : {newPrice}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <button
        onClick={handlePrint}
        className="py-2 px-8 bg-primary text-white rounded-full mt-6"
      >
        Print
      </button>
    </div>
  );
};

export default BarcodePrinted;
