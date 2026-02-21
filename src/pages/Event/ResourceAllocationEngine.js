/**
 * Resource Allocation Engine
 * Automatically suggests optimal resource allocation based on guest preferences
 * and real-time availability
 */

import EventInventoryService from "./EventInventoryService";
import GuestPreferencesService from "../Guests/GuestPreferencesService";

class ResourceAllocationEngine {
  /**
   * Suggest room assignments based on guest preferences and availability
   */
  static async suggestRoomAssignments(eventId) {
    try {
      const inventory = await EventInventoryService.getEventInventory(eventId);
      const guests = GuestPreferencesService.getAllGuests();

      if (!inventory || !guests.length) return [];

      const assignments = [];
      const availableRooms = [...inventory.rooms];

      // Sort guests by special needs (priority)
      const sortedGuests = [...guests].sort((a, b) => {
        const aNeeds = a.specialNeeds.length + (a.wheelchairAccessible ? 1 : 0);
        const bNeeds = b.specialNeeds.length + (b.wheelchairAccessible ? 1 : 0);
        return bNeeds - aNeeds;
      });

      sortedGuests.forEach(guest => {
        const suggestedRoom = this.findBestRoom(guest, availableRooms);

        if (suggestedRoom) {
          assignments.push({
            guestId: guest.id,
            guestName: guest.name,
            preferredRoom: suggestedRoom.type,
            roomId: suggestedRoom.id,
            reason: this.getAssignmentReason(guest, suggestedRoom),
            confidence: this.calculateConfidence(guest, suggestedRoom)
          });

          // Decrement available rooms
          suggestedRoom.available = (suggestedRoom.available || 1) - 1;
        }
      });

      return assignments;
    } catch (error) {
      console.error("Error suggesting room assignments:", error);
      return [];
    }
  }

  /**
   * Find best room for a guest based on preferences
   */
  static findBestRoom(guest, availableRooms) {
    // Accessibility rooms take priority
    if (guest.wheelchairAccessible || guest.mobilityAssistance) {
      const accessibleRoom = availableRooms.find(
        r =>
          r.accessible && r.available > 0 &&
          r.type.toLowerCase().includes("accessible")
      );
      if (accessibleRoom) return accessibleRoom;
    }

    // Match preferred room type
    const preferredRoom = availableRooms.find(
      r =>
        r.type.toLowerCase().includes(guest.roomPreference) &&
        r.available > 0
    );
    if (preferredRoom) return preferredRoom;

    // Match floor preference
    if (guest.highFloor) {
      const highFloorRoom = availableRooms.find(
        r => r.highFloor && r.available > 0
      );
      if (highFloorRoom) return highFloorRoom;
    }

    if (guest.groundFloor) {
      const groundFloorRoom = availableRooms.find(
        r => r.groundFloor && r.available > 0
      );
      if (groundFloorRoom) return groundFloorRoom;
    }

    // Default: return any available room
    return availableRooms.find(r => r.available > 0);
  }

  /**
   * Get assignment reason
   */
  static getAssignmentReason(guest, room) {
    if (guest.wheelchairAccessible && room.type.includes("Accessible")) {
      return "Wheelchair accessible accommodation";
    }
    if (guest.quietRoom && room.quiet) {
      return "Quiet room preference";
    }
    if (guest.highFloor && room.highFloor) {
      return "High floor preference";
    }
    if (guest.groundFloor && room.groundFloor) {
      return "Ground floor preference";
    }
    return "Best available match";
  }

  /**
   * Calculate assignment confidence (0-100)
   */
  static calculateConfidence(guest, room) {
    let confidence = 70; // Base confidence

    if (guest.wheelchairAccessible && room.accessible) confidence += 30;
    if (guest.quietRoom && room.quiet) confidence += 10;
    if (
      guest.roomPreference &&
      room.type.toLowerCase().includes(guest.roomPreference)
    )
      confidence += 15;

    return Math.min(100, confidence);
  }

  /**
   * Suggest dining options based on guest preferences
   */
  static async suggestDiningOptions(eventId) {
    try {
      const inventory = await EventInventoryService.getEventInventory(eventId);
      const guests = GuestPreferencesService.getAllGuests();

      if (!inventory || !guests.length) return [];

      const suggestions = [];
      const dietarySummary = {};

      // Calculate dietary requirements
      guests.forEach(guest => {
        guest.dietaryRequirements.forEach(diet => {
          dietarySummary[diet] = (dietarySummary[diet] || 0) + 1;
        });
      });

      // Find matching dining options
      inventory.dining.forEach(diningOption => {
        const matchingGuests = guests.filter(g =>
          g.dietaryRequirements.some(d =>
            diningOption.dietaryOptions?.includes(d)
          )
        );

        if (matchingGuests.length > 0 && diningOption.available > 0) {
          suggestions.push({
            diningId: diningOption.id,
            mealType: diningOption.mealType,
            dietaryOptions: diningOption.dietaryOptions,
            capacity: diningOption.capacity,
            available: diningOption.available,
            matchingGuests: matchingGuests.length,
            recommendedSlots: Math.min(matchingGuests.length, diningOption.available),
            utilized: Math.round(
              ((matchingGuests.length / diningOption.capacity) * 100)
            )
          });
        }
      });

      // Sort by utilization
      return suggestions.sort((a, b) => b.utilized - a.utilized);
    } catch (error) {
      console.error("Error suggesting dining options:", error);
      return [];
    }
  }

  /**
   * Suggest activities based on guest interests
   */
  static async suggestActivities(eventId) {
    try {
      const inventory = await EventInventoryService.getEventInventory(eventId);
      const guests = GuestPreferencesService.getAllGuests();

      if (!inventory || !guests.length) return [];

      const suggestions = [];

      // For now, suggest all available activities with capacity info
      inventory.activities.forEach(activity => {
        if (activity.available > 0) {
          suggestions.push({
            activityId: activity.id,
            name: activity.name,
            description: activity.description,
            capacity: activity.capacity,
            available: activity.available,
            registered: activity.registered,
            time: activity.time,
            duration: activity.duration,
            utilizationRate: Math.round(
              ((activity.registered / activity.capacity) * 100)
            ),
            recommendForGuests: Math.min(activity.available, guests.length)
          });
        }
      });

      // Sort by availability
      return suggestions.sort((a, b) => b.available - a.available);
    } catch (error) {
      console.error("Error suggesting activities:", error);
      return [];
    }
  }

  /**
   * Suggest transport options
   */
  static suggestTransportOptions(eventId) {
    try {
      const inventory = EventInventoryService.getEventInventory(eventId);
      const guests = GuestPreferencesService.getAllGuests();

      if (!inventory || !guests.length) return [];

      const suggestions = [];
      const totalGuests = guests.length;

      inventory.transport.forEach(transport => {
        if (transport.available > 0) {
          const requiredVehicles = Math.ceil(totalGuests / transport.capacity);
          const availability = Math.floor(transport.available / transport.capacity);

          suggestions.push({
            transportId: transport.id,
            type: transport.type,
            capacity: transport.capacity,
            available: transport.available,
            reserved: transport.reserved,
            requiredCapacity: totalGuests,
            suggestedVehicles: requiredVehicles,
            availableVehicles: availability,
            sufficient: availability >= requiredVehicles,
            utilizationRate: Math.round(
              ((transport.reserved / transport.capacity) * 100)
            )
          });
        }
      });

      return suggestions;
    } catch (error) {
      console.error("Error suggesting transport options:", error);
      return [];
    }
  }

  /**
   * Get allocation recommendations summary
   */
  static getAllocationRecommendations(eventId) {
    try {
      const roomAssignments = this.suggestRoomAssignments(eventId);
      const diningOptions = this.suggestDiningOptions(eventId);
      const activities = this.suggestActivities(eventId);
      const transport = this.suggestTransportOptions(eventId);

      return {
        rooms: {
          total: roomAssignments.length,
          suggestions: roomAssignments,
          status: roomAssignments.length > 0 ? "ready" : "pending"
        },
        dining: {
          total: diningOptions.length,
          suggestions: diningOptions,
          status: diningOptions.length > 0 ? "ready" : "pending"
        },
        activities: {
          total: activities.length,
          suggestions: activities,
          status: activities.length > 0 ? "ready" : "none_available"
        },
        transport: {
          total: transport.length,
          suggestions: transport,
          status: transport.length > 0 ? "ready" : "pending"
        },
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return null;
    }
  }

  /**
   * Apply allocation (save assignments)
   */
  static applyAllocation(eventId, allocationType, allocations) {
    try {
      const inventory = EventInventoryService.getEventInventory(eventId);
      if (!inventory) throw new Error("Event inventory not found");

      allocations.forEach(allocation => {
        if (allocationType === "rooms" && allocation.roomId) {
          EventInventoryService.updateRoomAvailability(eventId, allocation.roomId, -1);
        } else if (allocationType === "dining" && allocation.diningId) {
          EventInventoryService.updateDiningAvailability(
            eventId,
            allocation.diningId,
            -allocation.slots || -1
          );
        } else if (allocationType === "activities" && allocation.activityId) {
          EventInventoryService.updateActivityAvailability(
            eventId,
            allocation.activityId,
            -allocation.slots || -1
          );
        } else if (allocationType === "transport" && allocation.transportId) {
          EventInventoryService.updateTransportAvailability(
            eventId,
            allocation.transportId,
            -allocation.slots || -1
          );
        }
      });

      return {
        success: true,
        allocationType,
        appliedCount: allocations.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error applying allocation:", error);
      throw error;
    }
  }

  /**
   * Generate allocation report
   */
  static generateAllocationReport(eventId) {
    try {
      const inventory = EventInventoryService.getEventInventory(eventId);
      const guests = GuestPreferencesService.getAllGuests();
      const occupancy = EventInventoryService.getOccupancyRates(eventId);
      const summary = EventInventoryService.getInventorySummary(eventId);
      const alerts = EventInventoryService.getAvailabilityAlerts(eventId);

      return {
        eventName: inventory?.eventName || "Unknown Event",
        totalGuests: guests.length,
        reportDate: new Date().toISOString(),
        inventory: summary,
        occupancy: occupancy,
        alerts: alerts,
        recommendations: this.getAllocationRecommendations(eventId)
      };
    } catch (error) {
      console.error("Error generating allocation report:", error);
      return null;
    }
  }
}

export default ResourceAllocationEngine;
