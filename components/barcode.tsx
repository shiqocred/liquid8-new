"use client";

import React, { useRef } from "react";
import Barcode from "react-barcode";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";
import { formatRupiah } from "@/lib/utils";

interface BarcodePrint {
  oldPrice: string;
  newPrice: string;
  barcode: string;
  category: string;
  isBundle?: boolean;
  cancel?: () => void;
}

const BarcodePrinted: React.FC<BarcodePrint> = ({
  oldPrice,
  newPrice,
  barcode,
  category,
  isBundle,
  cancel,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <div className="border rounded-md border-gray-500 p-2 w-fit">
        <div
          style={{
            width: "7cm",
            height: "4cm",
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            fontFamily: "sans-serif",
            padding: "5px",
          }}
          className="print-container"
          ref={componentRef}
        >
          <div style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Barcode
                fontOptions="bold"
                textMargin={3}
                fontSize={16}
                font="sans-serif"
                value={barcode}
                width={1.2}
                height={50}
              />
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
                    width: 80,
                    height: 28.67,
                  }}
                >
                  <Image src={"/images/logo-barcode.png"} alt="barcode" fill />
                </div>
                <div
                  style={{
                    width: 80,
                    border: "1px solid black",
                    padding: "4px 8px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: 10,
                      lineHeight: 1.2,
                    }}
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
                    : {formatRupiah(parseFloat(oldPrice))}
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
                    : {formatRupiah(parseFloat(newPrice))}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-6">
        {cancel && (
          <button
            onClick={cancel}
            className="py-2 px-8 bg-gray-300/80 text-black rounded-full hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handlePrint}
          className="py-2 px-8 bg-sky-400/80 text-black rounded-full hover:bg-sky-400"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default BarcodePrinted;
