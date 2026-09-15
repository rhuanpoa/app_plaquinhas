import type { Plate, PlateStatus } from "@/types";
import { daysAgoIso } from "./dates";

interface PlateSeed {
  code: string;
  clientName: string | null;
  status: PlateStatus;
  scans: number;
  createdDaysAgo: number;
  updatedDaysAgo: number;
}

const PLATE_SEEDS: PlateSeed[] = [
  { code: "QR001", clientName: "Barbearia João", status: "active", scans: 342, createdDaysAgo: 96, updatedDaysAgo: 0 },
  { code: "QR002", clientName: "Clínica Maria", status: "active", scans: 188, createdDaysAgo: 88, updatedDaysAgo: 1 },
  { code: "QR003", clientName: null, status: "available", scans: 0, createdDaysAgo: 40, updatedDaysAgo: 40 },
  { code: "QR004", clientName: "Restaurante Central", status: "active", scans: 521, createdDaysAgo: 120, updatedDaysAgo: 3 },
  { code: "QR005", clientName: null, status: "available", scans: 0, createdDaysAgo: 40, updatedDaysAgo: 40 },
  { code: "QR006", clientName: "Salão da Ana", status: "disabled", scans: 97, createdDaysAgo: 76, updatedDaysAgo: 4 },
  { code: "QR007", clientName: "Pizzaria Nonna", status: "active", scans: 264, createdDaysAgo: 110, updatedDaysAgo: 5 },
  { code: "QR008", clientName: null, status: "available", scans: 0, createdDaysAgo: 40, updatedDaysAgo: 40 },
  { code: "QR009", clientName: "Auto Center Silva", status: "disabled", scans: 43, createdDaysAgo: 130, updatedDaysAgo: 8 },
  { code: "QR010", clientName: "Petshop Amigo Fiel", status: "active", scans: 156, createdDaysAgo: 90, updatedDaysAgo: 9 },
  { code: "QR011", clientName: null, status: "available", scans: 0, createdDaysAgo: 25, updatedDaysAgo: 25 },
  { code: "QR012", clientName: "Studio Pilates Corpo Leve", status: "active", scans: 78, createdDaysAgo: 85, updatedDaysAgo: 11 },
  { code: "QR013", clientName: "Padaria Pão Quente", status: "active", scans: 402, createdDaysAgo: 140, updatedDaysAgo: 12 },
  { code: "QR014", clientName: null, status: "available", scans: 0, createdDaysAgo: 25, updatedDaysAgo: 25 },
  { code: "QR015", clientName: "Ótica Visão Clara", status: "disabled", scans: 22, createdDaysAgo: 150, updatedDaysAgo: 15 },
  { code: "QR016", clientName: "Academia Força Total", status: "active", scans: 311, createdDaysAgo: 160, updatedDaysAgo: 17 },
  { code: "QR017", clientName: null, status: "available", scans: 0, createdDaysAgo: 12, updatedDaysAgo: 12 },
  { code: "QR018", clientName: "Consultório Dr. Paulo", status: "active", scans: 64, createdDaysAgo: 170, updatedDaysAgo: 20 },
  { code: "QR019", clientName: "Lava Rápido Brilho", status: "active", scans: 129, createdDaysAgo: 175, updatedDaysAgo: 22 },
  { code: "QR020", clientName: null, status: "available", scans: 0, createdDaysAgo: 12, updatedDaysAgo: 12 },
];

function toFakeReviewUrl(clientName: string): string {
  const slug = clientName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `https://g.page/r/${slug}/review`;
}

export function buildMockPlates(now: Date = new Date()): Plate[] {
  return PLATE_SEEDS.map((seed) => ({
    id: seed.code.toLowerCase(),
    code: seed.code,
    clientName: seed.clientName,
    destinationUrl: seed.clientName ? toFakeReviewUrl(seed.clientName) : null,
    status: seed.status,
    scans: seed.scans,
    createdAt: daysAgoIso(seed.createdDaysAgo, now),
    updatedAt: daysAgoIso(seed.updatedDaysAgo, now),
  }));
}
