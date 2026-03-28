import type { IndexedEvent } from "../shared/types.js";

const events: IndexedEvent[] = [];

export function addEvent(event: IndexedEvent) {
  events.push(event);
}

export function getEvents(filter?: {
  eventName?: string;
  contractAddress?: string;
  limit?: number;
}): IndexedEvent[] {
  let result = events;

  if (filter?.eventName) {
    result = result.filter((e) => e.eventName === filter.eventName);
  }
  if (filter?.contractAddress) {
    const addr = filter.contractAddress.toLowerCase();
    result = result.filter((e) => e.contractAddress.toLowerCase() === addr);
  }

  // Most recent first
  result = [...result].reverse();

  if (filter?.limit) {
    result = result.slice(0, filter.limit);
  }

  return result;
}

export function getEventCount(): number {
  return events.length;
}
