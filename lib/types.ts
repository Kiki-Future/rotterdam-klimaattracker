// The shapes of the data files. These match the Terra Studio reference
// repo. Don't change them without updating the research skill that
// produces the files.

export type Condition =
  | "any"
  | "heat-high"
  | "heat-extreme"
  | "cold-extreme"
  | "air-moderate"
  | "air-high"
  | "rain-heavy"
  | "flood-risk";

/**
 * Where to read the river signal. Rotterdam addition, not in the
 * reference schema: the flood model doesn't follow the Nieuwe Maas
 * through the city, so we read a big river upstream instead.
 */
export interface RiverPoint {
  label: string;
  latitude: number;
  longitude: number;
}

export interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  tagline: string;
  river?: RiverPoint;
}

export interface Source {
  title: string;
  url: string;
}

export interface Verification {
  status: "verified" | "flagged";
  lastChecked: string; // YYYY-MM-DD
  method: string;
  flag_reason?: string;
}

export interface Action {
  id: string;
  city: string;
  category: string;
  title: string;
  summary: string;
  details: string[];
  /** Which live conditions this action is relevant to. "any" shows always. */
  when: Condition[];
  sources: Source[];
  verification: Verification;
}
