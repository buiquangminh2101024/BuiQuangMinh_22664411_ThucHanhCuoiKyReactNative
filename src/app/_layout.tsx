import "../global.css";
import { Slot } from "expo-router";
import { InitDb } from "../../db/db"

export default function Layout() {
  return (
    <InitDb>
      <Slot />
    </InitDb>
  );
}
