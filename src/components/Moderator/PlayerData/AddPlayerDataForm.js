"use client";
import { useState } from "react";
import AddPlayerDataFormGoals from "./AddPlayerDataFormGoals";
import AddPlayerDataFormSaves from "./AddPlayerFormSaves";
import AddPlayerDataFormTackles from "./AddPlayerDataFormTackles";
import AddPlayerDataFormAdditonal from "./AddPlayerDataFormAdditional";

function AddPlayerDataForm({ playerId }) {
  const [display, setDisplay] = useState("goals");
  if (display === "goals")
    return (
      <AddPlayerDataFormGoals playerId={playerId} setDisplay={setDisplay} />
    );
  if (display === "saves")
    return (
      <AddPlayerDataFormSaves playerId={playerId} setDisplay={setDisplay} />
    );
  if (display === "tackles")
    return (
      <AddPlayerDataFormTackles playerId={playerId} setDisplay={setDisplay} />
    );
  if (display === "additional")
    return (
      <AddPlayerDataFormAdditonal playerId={playerId} setDisplay={setDisplay} />
    );
}

export default AddPlayerDataForm;
