"use client";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { X } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";

interface MultiSelectProps {
  placeholder: string;
  collections: CollectionType[];
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  collections,
  value,
  onChange,
  onRemove,
}) => {
  // control the input field's value, updating it dynamically as the user types by storing the input in the inputValue state and changing it via setInputValue.
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  let selected: CollectionType[];

  if (value.length === 0) {
    selected = [];
  } else {
    //each id inside value we will find each collection's id which equals the id selected
    selected = value.map((id) =>
      collections.find((collection) => collection._id === id)
    ) as CollectionType[];
  }

  //remove option from drop down after selected
  const selectable = collections.filter((collection) => !selected.includes(collection)); //filtering out the selected collections



  return (
    <Command className="overflow-visible bg-white">
      <div className="flex gap-1 flex-wrap border rounded-md">
        {selected.map((collection) => (
          <Badge key={collection._id}>
            {collection.title}
            <button
              className="ml-1 hover:text-red-1"
              onClick={() => onRemove(collection._id)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <CommandInput
          placeholder={placeholder}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)} //open = true will show all collections
        />
      </div>

      <div className="relative mt-2">
        {open && (
            <CommandGroup className="absolute w-full z-30 top-0 overflow-auto border rounded-md shadow-md">
              {selectable.map((collection) => (
                //add onselect and onmouse down, event listeners to allow the multiselect to actually allow for selection.
                <CommandItem
                  key={collection._id}
                  onMouseDown={(e) => e.preventDefault()}
                  onSelect={() => {
                    onChange(collection._id);
                  }}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  {collection.title}
                </CommandItem>
              ))}
            </CommandGroup>
        )}
      </div>
    </Command>
  );
};

export default MultiSelect;
