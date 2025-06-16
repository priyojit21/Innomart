import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";

export const ProductDetails = ({ variation, register, control, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${variation}.details`,
  });

  const [keyValues, setKeyValues] = useState({});

  const handleKeyChange = (index, value) => {
    setKeyValues((prev) => ({ ...prev, [index]: value }));
  };

  return (
    <div>
      <p className="lg:w-[524px] bg-white  mb-[19px] border-b border-[#EEEEEE]">
        Product Details
      </p>
        <p className="text-xs text-red-600 font-semibold mb-3 h-[10px]">{errors?.details?.message}</p>
      {fields.map((item, index) => {
        const keyError = errors?.details?.[index]?.key;
        const valueError = errors?.details?.[index]?.value;

        return (
          <div key={item.id} className="flex gap-3 mb-3 items-start">
            <div className="w-1/2">
              <input
                className={`w-full text-gray-800 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md mb-[5px] ${
                  keyError ? "border-red-500" : ""
                }`}
                placeholder="Key"
                {...register(`${variation}.details[${index}].key`)}
                onChange={(e) => handleKeyChange(index, e.target.value)}
              />
              <span className="text-xs text-red-600 font-semibold h-[10px] mb-[15px]">
                &nbsp;{keyError?.message}
              </span>
            </div>

            <div className="w-1/2">
              {keyValues[index]?.toLowerCase() !== "color" ? (
                <input
                  className={`w-full text-gray-800 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md mb-[5px] ${
                    valueError ? "border-red-500" : ""
                  }`}
                  placeholder="Value"
                  type="text"
                  {...register(`${variation}.details[${index}].value`)}
                />
              ) : (
                <input
                  className={`rounded-full ${valueError ? "border-red-500" : ""}`}
                  placeholder="Value"
                  type="color"
                  {...register(`${variation}.details[${index}].value`)}
                />
              )}
              <span className="text-xs text-red-600 font-semibold h-[10px] mb-[15px]">
                &nbsp;{valueError?.message}
              </span>
            </div>
            {index > 0 && (
              <div className="flex items-center mt-2">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => append({ key: "", value: "" })}
        className="text-blue-500 hover:text-blue-700 cursor-pointer"
      >
        Add Detail
      </button>
    </div>
  );
};
