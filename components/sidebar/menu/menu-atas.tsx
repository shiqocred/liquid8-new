"use client";

import Image from "next/image";
import Link from "next/link";

const MenuAtas = () => {
  return (
    <div className="flex flex-col gap-2 items-start w-full  px-4 py-3">
      <Link href={"/"}>
        <button
          type="button"
          className="flex items-center leading-none h-10 transition-all rounded-md justify-start"
        >
          <h3 className="w-40 relative aspect-[260/87]">
            <Image src={"/images/liquid8.png"} alt="" fill />
          </h3>
        </button>
      </Link>
    </div>
  );
};

export default MenuAtas;
