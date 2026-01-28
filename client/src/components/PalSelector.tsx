import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
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
import type { Pal } from "@/hooks/use-breeding";

interface PalSelectorProps {
  pals: Pal[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  label?: string;
}

export function PalSelector({ pals, selectedId, onSelect, label }: PalSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const selectedPal = pals.find((pal) => pal.id === selectedId);

  return (
    <div className="w-full">
      {label && <div className="mb-2 text-sm font-semibold text-muted-foreground">{label}</div>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            role="combobox"
            aria-expanded={open}
            className="flex w-full items-center justify-between rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {selectedPal ? (
              <div className="flex items-center gap-3">
                <img 
                  src={selectedPal.image} 
                  alt="" 
                  className="h-6 w-6 rounded-full object-cover bg-muted"
                  onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?w=50&h=50&fit=crop"}
                />
                <span>{selectedPal.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Select a Pal...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput placeholder="Search pals..." className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
            <CommandList>
              <CommandEmpty>No pal found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {pals.map((pal) => (
                  <CommandItem
                    key={pal.id}
                    value={pal.name}
                    onSelect={() => {
                      onSelect(pal.id);
                      setOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    <img 
                      src={pal.image} 
                      alt="" 
                      className="h-8 w-8 rounded-full object-cover bg-muted"
                      onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?w=50&h=50&fit=crop"}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{pal.name}</span>
                      <div className="flex gap-1">
                        {pal.types.map(t => (
                          <span key={t} className="text-[10px] uppercase text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    </div>
                    <Check
                      className={clsx(
                        "ml-auto h-4 w-4",
                        selectedId === pal.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
