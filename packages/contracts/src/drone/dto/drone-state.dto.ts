import type { DroneState } from '../types/DroneState.type';
import { DroneStateSchema } from '../types/DroneState.type'

/**
 * @module DroneStateAdapter
 * @description
 * This module acts as the Seam/Adapter for the DroneState contract.
 * It does not redefine the contract; it provides API methods (like serialization/transformation)
 * around the canonical type definition.
 */

/**
 * Validates a raw object against the canonical schema.
 * This is the primary entry point for consumers that deal with untyped inputs.
 * @param rawState The raw object to validate.
 * @returns The validated DroneState object.
 */
export function validateDroneState(rawState: unknown): DroneState {
  return DroneStateSchema.parse(rawState);
}

/**
 * Converts the DroneState object into a compact wire format.
 * @param state The canonical DroneState object.
 * @returns A simplified object suitable for transport.
 */
export function toWireFormat(state: DroneState): { id: string, mode: string, heart: number } {
  // This is a deliberately thin adapter, focusing only on transport requirements
  return {
    id: state.droneId,
    mode: state.mode,
    heart: state.heartbeat,
  };
}
