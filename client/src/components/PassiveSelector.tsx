import * as React from "react";
import { Check, Plus, Search } from "lucide-react";
import { clsx } from "clsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Passive } from "@/hooks/use-breeding";
import { PassiveBadge } from "./PassiveBadge";

interface PassiveSelectorProps {
  passives: Passive[];
  selectedNames: string[];
  onSelect: (names: string[]) => void;
  max: number;
}

export function PassiveSelector({ passives, selectedNames, onSelect, max }: PassiveSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (name: string) => {
    if (selectedNames.includes(name)) {
      onSelect(selectedNames.filter((n) => n !== name));
    } else {
      if (selectedNames.length >= max) return;
      onSelect([...selectedNames, name]);
    }
  };

  const selectedPassives = selectedNames
    .map((name) => passives.find((p) => p.name === name))
    .filter((p): p is Passive => !!p);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {selectedPassives.map((passive) => (
          <PassiveBadge 
            key={passive.name} 
            passive={passive} 
            onRemove={() => handleSelect(passive.name)}
          />
        ))}
        {selectedNames.length < max && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1 rounded-md border border-dashed border-muted-foreground/50 px-2 py-1 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <Plus className="h-4 w-4" />
                Add Passive
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                 <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput placeholder="Search passives..." className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
                <CommandList>
                  <CommandEmpty>No passive found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-auto">
                    {passives.map((passive) => {
                      const isSelected = selectedNames.includes(passive.name);
                      return (
                        <CommandItem
                          key={passive.id}
                          value={passive.name}
                          onSelect={() => handleSelect(passive.name)}
                          disabled={!isSelected && selectedNames.length >= max}
                          className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{passive.name}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">{passive.description}</span>
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <div className="text-xs text-muted-foreground text-right">
        {selectedNames.length} / {max} passives
      </div>
    </div>
  );
}
