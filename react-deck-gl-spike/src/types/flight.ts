import { z } from 'zod';

// Airport schema
export const AirportSchema = z.object({
  code: z.string(), // IATA code (e.g., 'LAX')
  name: z.string(), // Full airport name
  city: z.string(),
  country: z.string(),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
});

export type Airport = z.infer<typeof AirportSchema>;

// Flight route schema
export const FlightRouteSchema = z.object({
  id: z.string(),
  origin: AirportSchema,
  destination: AirportSchema,
  frequency: z.number().min(0), // Flights per week
  passengerVolume: z.number().min(0).optional(), // Annual passengers
  airline: z.string().optional(),
  distance: z.number().min(0).optional(), // Distance in km
});

export type FlightRoute = z.infer<typeof FlightRouteSchema>;

// API response schema
export const FlightRoutesResponseSchema = z.object({
  routes: z.array(FlightRouteSchema),
  metadata: z
    .object({
      totalRoutes: z.number(),
      lastUpdated: z.string(),
    })
    .optional(),
});

export type FlightRoutesResponse = z.infer<typeof FlightRoutesResponseSchema>;
