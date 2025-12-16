"use client";
import { PlusSignIcon, MinusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface FilterSectionProps {
  title: string;
  items?: string[];
  selectedItems?: string[];
  onToggleItem?: (item: string) => void;
  open: boolean;
  onToggleOpen: () => void;
  counts?: Record<string, number>;
  children?: React.ReactNode;
  showAllBrands?: boolean;
  onShowAllBrands?: () => void;
  hasMoreBrands?: boolean;
}

export default function FilterSection({
  title,
  items = [],
  selectedItems = [],
  onToggleItem,
  open,
  onToggleOpen,
  counts = {},
  children,
  showAllBrands = false,
  onShowAllBrands,
  hasMoreBrands = false,
}: FilterSectionProps) {
  return (
    <div className="pb-2">
      <button
        onClick={onToggleOpen}
        className="w-full flex justify-between items-center bg-white hover:bg-gray-200 px-4 py-3 rounded-md font-medium text-gray-800 transition"
      >
        <span className="font-sans text-base font-semibold leading-6">{title}</span>
        {open ? (
          <HugeiconsIcon icon={MinusSignIcon} />
        ) : (
          <HugeiconsIcon icon={PlusSignIcon} />
        )}
      </button>

      {open && (
        <div className="mt-4 space-y-1 py-2">
          {children ? (
            children
          ) : (
            <>
              {items.map((item) => (
                <label
                  key={item}
                  className="flex justify-between text-sm items-center cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-sans text-base font-normal leading-6 pl-[12px]">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item)}
                      onChange={() => onToggleItem?.(item)}
                      className="w-4 h-4 accent-[#C9A040]"
                    />
                    {item}
                  </div>
                  <span className="text-gray-500 font-sans text-base font-normal leading-6 pr-4">
                    ({counts[item] || 0})
                  </span>
                </label>
              ))}
              {!showAllBrands && hasMoreBrands && onShowAllBrands && (
                <button
                  onClick={onShowAllBrands}
                  className="w-full text-left text-sm text-blue-600 hover:text-blue-800 font-medium pl-[12px] py-1 transition-colors"
                >
                  See more...
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}