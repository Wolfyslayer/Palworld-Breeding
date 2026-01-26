import React, { useState, useEffect } from "react";

export default function BreedingCalculator() {
  const [palsData, setPalsData] = useState([]);
  const [passivesData, setPassivesData] = useState([]);

  useEffect(() => {
    fetch("/data/pals.json")
      .then(res => res.json())
      .then(setPalsData)
      .catch(err => console.error("Failed to load pals.json", err));
    fetch("/data/passives.json")
      .then(res => res.json())
      .then(setPassivesData)
      .catch(err => console.error("Failed to load passives.json", err));
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Palworld Breeding Calculator</h1>
      <p>Make sure your JSON data exists in /public/data/.</p>
      <p>{palsData.length} pals and {passivesData.length} passives loaded.</p>
    </div>
  );
}
