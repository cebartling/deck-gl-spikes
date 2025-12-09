import { z } from 'zod';
import { AirportSchema } from './flight';

// Individual scheduled flight
export const ScheduledFlightSchema = z.object({
  id: z.string(),
  flightNumber: z.string(), // e.g., 'AA123'
  origin: AirportSchema,
  destination: AirportSchema,
  departureTime: z.number().min(0).max(1440), // Minutes from midnight (0-1440)
  arrivalTime: z.number().min(0).max(1440),
  airline: z.string().optional(),
  aircraftType: z.string().optional(), // e.g., 'B737', 'A320'
});

export type ScheduledFlight = z.infer<typeof ScheduledFlightSchema>;

// Flight position at a given time (computed)
export interface FlightPosition {
  flightId: string;
  flightNumber: string;
  longitude: number;
  latitude: number;
  bearing: number; // Heading in degrees
  progress: number; // 0-1 completion
  altitude: number; // Estimated altitude in feet
  origin: string;
  destination: string;
}

// Animation state
export interface AnimationState {
  currentTime: number; // Minutes from midnight (0-1440)
  isPlaying: boolean;
  playbackSpeed: number; // 1 = real-time, 60 = 1 hour per minute
  loopEnabled: boolean;
}

// API response schema for scheduled flights
export const ScheduledFlightsResponseSchema = z.object({
  flights: z.array(ScheduledFlightSchema),
  metadata: z
    .object({
      totalFlights: z.number().optional(),
      timezone: z.string().optional(),
      generatedAt: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});

export type ScheduledFlightsResponse = z.infer<
  typeof ScheduledFlightsResponseSchema
>;
