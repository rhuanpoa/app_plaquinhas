import type { Metadata } from "next";
import { PlatesView } from "@/components/plates/plates-view";

export const metadata: Metadata = { title: "Placas" };

export default function PlatesPage() {
  return <PlatesView />;
}
