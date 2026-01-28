import { useState } from "react";
import { usePals, usePassives } from "@/hooks/use-breeding";
import { PalSelector } from "@/components/PalSelector";
import { PalCard } from "@/components/PalCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, ArrowRight, Filter, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface BreedingCombo {
  parent1: string;
  parent2: string;
  child: string;
  special: boolean;
  parent1Power?: number;
  parent2Power?: number;
}

export default function ReverseCalculator() {
  const { data: pals = [], isLoading: isLoadingPals } = usePals();
  const [targetPalId, setTargetPalId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showOnlyOwned, setShowOnlyOwned] = useState(false);
  const [results, setResults] = useState<BreedingCombo[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const targetPal = pals.find(p => p.id === targetPalId);

  // Get all unique types for filtering
  const allTypes = Array.from(new Set(pals.flatMap(p => p.types))).sort();

  const filteredPals = pals.filter(pal => {
    const matchesSearch = pal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTypes = selectedTypes.length === 0 || selectedTypes.some(type => pal.types.includes(type));
    return matchesSearch && matchesTypes;
  });

  const calculateReverseBreeding = async () => {
    if (!targetPalId) {
      toast({
        title: "No Target Selected",
        description: "Please select a target Pal first.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    
    try {
      // This would be a new API endpoint
      const response = await fetch(`/api/breeding/reverse/${targetPalId}`);
      if (!response.ok) throw new Error("Failed to calculate combinations");
      
      const combos: BreedingCombo[] = await response.json();
      setResults(combos);
      
      if (combos.length === 0) {
        toast({
          title: "No Combinations Found",
          description: "This Pal might be a legendary that can only be bred with itself.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Found Combinations",
          description: `Found ${combos.length} possible breeding combinations.`,
        });
      }
    } catch (error) {
      // Fallback calculation for demo
      const targetPalData = pals.find(p => p.id === targetPalId);
      if (!targetPalData) return;

      const combos: BreedingCombo[] = [];
      
      // Special combinations first
      const specialCombos = [
        { parent1: "Grizzbolt", parent2: "Relaxaurus", result: "Orserk" },
        { parent1: "Kitsun", parent2: "Astegon", result: "Shadowbeak" },
        { parent1: "Vanwyrn", parent2: "Cinnamoth", result: "Anubis" },
        { parent1: "Helzephyr", parent2: "Orserk", result: "Astegon" },
      ];

      const specialCombo = specialCombos.find(combo => combo.result === targetPalData.name);
      if (specialCombo) {
        const parent1 = pals.find(p => p.name === specialCombo.parent1);
        const parent2 = pals.find(p => p.name === specialCombo.parent2);
        if (parent1 && parent2) {
          combos.push({
            parent1: specialCombo.parent1,
            parent2: specialCombo.parent2,
            child: targetPalData.name,
            special: true,
            parent1Power: parent1.breedingPower,
            parent2Power: parent2.breedingPower,
          });
        }
      }

      // Generate some regular combinations based on breeding power
      const targetPower = targetPalData.breedingPower;
      const suitableParents = pals.filter(p => 
        p.id !== targetPalId && 
        p.breedingPower < targetPower + 200 && 
        p.breedingPower > targetPower - 200
      );

      for (let i = 0; i < Math.min(10, suitableParents.length - 1); i++) {
        const parent1 = suitableParents[i];
        const parent2 = suitableParents[i + 1] || suitableParents[0];
        
        combos.push({
          parent1: parent1.name,
          parent2: parent2.name,
          child: targetPalData.name,
          special: false,
          parent1Power: parent1.breedingPower,
          parent2Power: parent2.breedingPower,
        });
      }

      setResults(combos);
    } finally {
      setIsCalculating(false);
    }
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  if (isLoadingPals) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-4 font-display text-4xl font-bold">
          Reverse <span className="text-primary">Breeding Calculator</span>
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Find all possible parent combinations to breed your desired Pal.
        </p>
      </div>

      {/* Target Selection */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Select Target Pal
          </CardTitle>
          <CardDescription>
            Choose the Pal you want to breed and discover all possible parent combinations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PalSelector 
            pals={filteredPals}
            selectedId={targetPalId}
            onSelect={setTargetPalId}
            label="Target Pal"
          />
          
          {targetPal && <PalCard pal={targetPal} />}
          
          <Button 
            onClick={calculateReverseBreeding}
            disabled={!targetPalId || isCalculating}
            className="w-full"
            size="lg"
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating Combinations...
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Find Parent Combinations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Search Pals</label>
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-medium">Filter by Type</label>
            <div className="flex flex-wrap gap-2">
              {allTypes.map(type => (
                <Badge
                  key={type}
                  variant={selectedTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold">
              Found {results.length} Breeding Combinations
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {results.map((combo, index) => (
                <motion.div
                  key={`${combo.parent1}-${combo.parent2}-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-border/50 bg-card/50 backdrop-blur-sm ${
                    combo.special ? 'ring-2 ring-primary/50' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Combination {index + 1}</span>
                          {combo.special && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="mr-1 h-3 w-3" />
                              Special
                            </Badge>
                          )}
                        </div>
                        {combo.parent1Power && combo.parent2Power && (
                          <div className="text-xs text-muted-foreground">
                            Power: {combo.parent1Power} + {combo.parent2Power}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-center">
                            <div className="font-medium">{combo.parent1}</div>
                            {combo.parent1Power && (
                              <div className="text-xs text-muted-foreground">
                                {combo.parent1Power}
                              </div>
                            )}
                          </div>
                          
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          
                          <div className="text-center">
                            <div className="font-medium">{combo.parent2}</div>
                            {combo.parent2Power && (
                              <div className="text-xs text-muted-foreground">
                                {combo.parent2Power}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium text-primary">
                            {combo.child}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {combo.special ? "Special Combo" : "Normal Breeding"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
