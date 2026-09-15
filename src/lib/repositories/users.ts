import { MOCK_USER } from "@/data/mock/user";
import type { User, UserUpdate } from "@/types";
import { readStored, simulateLatency, writeStored } from "./mock-store";

const STORAGE_KEY = "reviewqr:v1:user";

export async function getCurrentUser(): Promise<User> {
  await simulateLatency(150);
  return readStored(STORAGE_KEY, () => MOCK_USER);
}

export async function updateCurrentUser(data: UserUpdate): Promise<User> {
  await simulateLatency(500);
  const updated: User = {
    ...readStored(STORAGE_KEY, () => MOCK_USER),
    name: data.name.trim(),
    email: data.email.trim(),
  };
  writeStored(STORAGE_KEY, updated);
  return updated;
}
