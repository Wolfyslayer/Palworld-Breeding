import * as React from "react";
import { Check, Plus, Search, Filter, Heart } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Pal } from "@/hooks/use-breeding";
import { PalCard } from "./PalCard";

interface EnhancedPalSelectorProps {
  pals: Pal[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  label: string;
  ownedPals?: number[];
  onToggleOwned?: (palId: number) => void;
  showOwnedFilter?: boolean;
  showTypeFilter?: boolean;
  showPowerFilter?: boolean;
}

export function EnhancedPalSelector({ 
  pals, 
  selectedId, 
  onSelect, 
  label,
  ownedPals = [],
  onToggleOwned,
  showOwnedFilter = true,
  showTypeFilter = true,
  showPowerFilter = true
}: EnhancedPalSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);
  const [powerRange, setPowerRange] = React.useState<[number, number]>([0, 9999]);
  const [showOnlyOwned, setShowOnlyOwned] = React.useState(false);

  // Get all unique types and power range
  const allTypes = React.useMemo(() => 
    Array.from(new Set(pals.flatMap(p => p.types))).sort(),
    [pals]
  );

  const minPower = React.useMemo(() => Math.min(...pals.map(p => p.breedingPower)), [pals]);
  const maxPower = React.useMemo(() => Math.max(...pals.map(p => p.breedingPower)), [pals]);

  React.useEffect(() => {
    setPowerRange([minPower, maxPower]);
  }, [minPower, maxPower]);

  // Filter pals based on all criteria
  const filteredPals = React.useMemo(() => {
    return pals.filter(pal => {
      const matchesSearch = pal.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTypes = selectedTypes.length === 0 || selectedTypes.some(type => pal.types.includes(type));
      const matchesPower = pal.breedingPower >= powerRange[0] && pal.breedingPower <= powerRange[1];
      const matchesOwned = !showOnlyOwned || ownedPals.includes(pal.id);
      
      return matchesSearch && matchesTypes && matchesPower && matchesOwned;
    });
  }, [pals, searchTerm, selectedTypes, powerRange, showOnlyOwned, ownedPals]);

  const selectedPal = pals.find(p => p.id === selectedId);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    setPowerRange([minPower, maxPower]);
    setShowOnlyOwned(false);
  };

  const activeFiltersCount = [
    searchTerm.length > 0,
    selectedTypes.length > 0,
    powerRange[0] > minPower || powerRange[1] < maxPower,
    showOnlyOwned
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Main Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{label}</label>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              Clear {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
            </Button>
          )}
        </div>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedPal ? selectedPal.name : `Select ${label.toLowerCase()}...`}
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[500px] p-0" align="start">
            <Command>
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <CommandInput 
                  placeholder="Search Pals..." 
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" 
                />
              </div>
              
              {/* Filters */}
              <div className="border-b bg-muted/30 p-3 space-y-3">
                {showOwnedFilter && onToggleOwned && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Owned Pals Only</span>
                    <Button
                      variant={showOnlyOwned ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowOnlyOwned(!showOnlyOwned)}
                      className="h-7"
                    >
                      <Heart className={`h-3 w-3 ${showOnlyOwned ? 'fill-current' : ''}`} />
                      {ownedPals.length}
                    </Button>
                  </div>
                )}

                {showTypeFilter && (
                  <div>
                    <span className="text-sm font-medium mb-2 block">Types</span>
                    <div className="flex flex-wrap gap-1">
                      {allTypes.map(type => (
                        <Badge
                          key={type}
                          variant={selectedTypes.includes(type) ? "default" : "outline"}
                          className="cursor-pointer text-xs"
                          onClick={() => toggleType(type)}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {showPowerFilter && (
                  <div>
                    <span className="text-sm font-medium mb-2 block">
                      Power Range: {powerRange[0]} - {powerRange[1]}
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min={minPower}
                        max={maxPower}
                        value={powerRange[0]}
                        onChange={(e) => setPowerRange([parseInt(e.target.value), powerRange[1]])}
                        className="flex-1"
                      />
                      <input
                        type="range"
                        min={minPower}
                        max={maxPower}
                        value={powerRange[1]}
                        onChange={(e) => setPowerRange([powerRange[0], parseInt(e.target.value)])}
                        className="flex-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              <CommandList>
                <CommandEmpty>
                  {filteredPals.length === 0 ? "No Pal found." : "No matching Pal found."}
                </CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {filteredPals.map((pal) => {
                    const isOwned = ownedPals.includes(pal.id);
                    const isSelected = selectedId === pal.id;
                    
                    return (
                      <CommandItem
                        key={pal.id}
                        value={pal.name}
                        onSelect={() => {
                          onSelect(pal.id);
                          setOpen(false);
                        }}
                        className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{pal.name}</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              {pal.types.map(type => (
                                <Badge key={type} variant="outline" className="text-xs px-1 py-0">
                                  {type}
                                </Badge>
                              ))}
                              <span>Power: {pal.breedingPower}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isOwned && (
                            <Heart className="h-4 w-4 fill-current text-red-500" />
                          )}
                          {onToggleOwned && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleOwned(pal.id);
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Heart className={`h-3 w-3 ${isOwned ? 'fill-current text-red-500' : ''}`} />
                            </Button>
                          )}
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected Pal Card */}
      {selectedPal && (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedPal.image} 
                  alt={selectedPal.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold">{selectedPal.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {selectedPal.types.map(type => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                    <span>Power: {selectedPal.breedingPower}</span>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelect(null)}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="text-xs text-muted-foreground text-right">
        Showing {filteredPals.length} of {pals.length} Pals
        {ownedPals.length > 0 && ` • ${ownedPals.length} owned`}
      </div>
    </div>
  );
}
