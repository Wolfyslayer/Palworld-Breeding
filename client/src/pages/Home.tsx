import { useState } from "react";
import { usePals, usePassives, useCalculateBreeding, type CalculationResponse } from "@/hooks/use-breeding";
import { EnhancedPalSelector } from "@/components/EnhancedPalSelector";
import { PassiveSelector } from "@/components/PassiveSelector";
import { PalCard } from "@/components/PalCard";
import { ProbabilityTable } from "@/components/ProbabilityTable";
import { Loader2, ArrowRight, Dna, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const { data: pals = [], isLoading: isLoadingPals } = usePals();
  const { data: passives = [], isLoading: isLoadingPassives } = usePassives();
  const calculateMutation = useCalculateBreeding();

  // Form State
  const [parent1Id, setParent1Id] = useState<number | null>(null);
  const [parent2Id, setParent2Id] = useState<number | null>(null);
  const [parent1Passives, setParent1Passives] = useState<string[]>([]);
  const [parent2Passives, setParent2Passives] = useState<string[]>([]);
  const [ownedPals, setOwnedPals] = useState<number[]>([]);
  
  // Result State
  const [result, setResult] = useState<CalculationResponse | null>(null);

  const handleCalculate = async () => {
    if (!parent1Id || !parent2Id) {
      toast({
        title: "Missing Parents",
        description: "Please select both parents to calculate breeding.",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = await calculateMutation.mutateAsync({
        parent1Id,
        parent2Id,
        parent1Passives,
        parent2Passives,
      });
      setResult(data);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Calculation failed",
        variant: "destructive",
      });
    }
  };

  const toggleOwnedPal = (palId: number) => {
    setOwnedPals(prev => 
      prev.includes(palId) 
        ? prev.filter(id => id !== palId)
        : [...prev, palId]
    );
  };

  if (isLoadingPals || isLoadingPassives) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-primary">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  const parent1 = pals.find(p => p.id === parent1Id) || null;
  const parent2 = pals.find(p => p.id === parent2Id) || null;

  return (
    <div className="pb-20">
        {/* Intro */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-4xl font-bold sm:text-5xl">
            Optimize Your <span className="text-primary">Lineage</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Select two parents and their passives to calculate the offspring species and inheritance probabilities.
          </p>
        </div>

        {/* Owned Pals Summary */}
        {ownedPals.length > 0 && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary fill-current" />
                  <span className="font-medium">Your Collection</span>
                  <Badge variant="secondary">{ownedPals.length} Pals</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOwnedPals([])}
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calculator Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr] items-start">
          
          {/* Parent 1 Column */}
          <section className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xl card-gradient">
            <h3 className="flex items-center gap-2 font-display text-xl font-bold text-blue-400">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-sm">1</span>
              Parent One
            </h3>
            
            <div className="space-y-4">
              <EnhancedPalSelector 
                pals={pals}
                selectedId={parent1Id}
                onSelect={setParent1Id}
                label="First Parent"
                ownedPals={ownedPals}
                onToggleOwned={toggleOwnedPal}
                showOwnedFilter={true}
              />
              
              {parent1 && <PalCard pal={parent1} />}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Passive Skills (max 4)</label>
                <PassiveSelector 
                  passives={passives}
                  selectedNames={parent1Passives}
                  onSelect={setParent1Passives}
                  max={4}
                />
              </div>
            </div>
          </section>

          {/* Calculate Button */}
          <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </motion.div>
            
            <Button
              onClick={handleCalculate}
              disabled={!parent1Id || !parent2Id || calculateMutation.isPending}
              size="lg"
              className="px-8"
            >
              {calculateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Dna className="mr-2 h-4 w-4" />
                  Breed
                </>
              )}
            </Button>
            
            <div className="text-xs text-muted-foreground text-center">
              {parent1 && parent2 && (
                <span>Power: {parent1.breedingPower} + {parent2.breedingPower} = {parent1.breedingPower + parent2.breedingPower}</span>
              )}
            </div>
          </div>

          {/* Parent 2 Column */}
          <section className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xl card-gradient">
            <h3 className="flex items-center gap-2 font-display text-xl font-bold text-green-400">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-sm">2</span>
              Parent Two
            </h3>
            
            <div className="space-y-4">
              <EnhancedPalSelector 
                pals={pals}
                selectedId={parent2Id}
                onSelect={setParent2Id}
                label="Second Parent"
                ownedPals={ownedPals}
                onToggleOwned={toggleOwnedPal}
                showOwnedFilter={true}
              />
              
              {parent2 && <PalCard pal={parent2} />}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Passive Skills (max 4)</label>
                <PassiveSelector 
                  passives={passives}
                  selectedNames={parent2Passives}
                  onSelect={setParent2Passives}
                  max={4}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              id="results-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12"
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🎉</span>
                    Breeding Results
                  </CardTitle>
                  <CardDescription>
                    Offspring: {result.child.name} ({result.child.types.join(', ')})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Child Pal Display */}
                    <div className="flex justify-center">
                      <PalCard pal={result.child} />
                    </div>
                    
                    {/* Probability Table */}
                    <div>
                      <h4 className="mb-4 text-lg font-semibold">Passive Skill Inheritance Probabilities</h4>
                      <ProbabilityTable probabilities={result.probabilities} allPassives={passives} />
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex justify-center gap-4">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setParent1Id(result.child.id);
                          setParent1Passives([]);
                          setResult(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Use as Parent 1
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setParent2Id(result.child.id);
                          setParent2Passives([]);
                          setResult(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Use as Parent 2
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
