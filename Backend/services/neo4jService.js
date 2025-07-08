const { getSession } = require('../config/neo4jClient');

const neo4jService = {
  /**
   * Ensures a User node exists for the given userId.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<void>}
   */
  async createUserNode(userId) {
    const session = getSession();
    try {
      await session.run(
        `MERGE (u:User {id: $userId})
         ON CREATE SET u.flightBookingsCount = 0, u.hotelBookingsCount = 0, u.totalFlightSpend = 0.0, u.totalHotelSpend = 0.0
         MERGE (u)-[:HAS_FLIGHT_PREFERENCES]->(fp:FlightPreferences)
         MERGE (u)-[:HAS_HOTEL_PREFERENCES]->(hp:HotelPreferences)
         RETURN u`,
        { userId }
      );
      console.log(`Ensured User node and preference grouping nodes for ID: ${userId}`);
    } catch (error) {
      console.error(`Error ensuring User node and preference grouping nodes for ${userId}:`, error);
      throw error;
    } finally {
      session.close();
    }
  },

  /**
   * Increments flight or hotel booking counts for a user.
   * @param {string} userId - The ID of the user.
   * @param {'flight'|'hotel'} type - The type of booking to increment.
   * @returns {Promise<void>}
   */
  async updateBookingCounts(userId, type) {
    const session = getSession();
    const counterField = type === 'flight' ? 'flightBookingsCount' : 'hotelBookingsCount';
    try {
      await session.run(
        `MERGE (u:User {id: $userId})
         ON CREATE SET u.${counterField} = 1
         ON MATCH SET u.${counterField} = u.${counterField} + 1
         RETURN u`,
        { userId }
      );
      console.log(`Updated ${type} booking count for user ${userId}`);
    } catch (error) {
      console.error(`Error updating ${type} booking count for ${userId}:`, error);
      throw error;
    } finally {
      session.close();
    }
  },

  /**
   * Updates the total spend for flight or hotel bookings for a user.
   * @param {string} userId - The ID of the user.
   * @param {'flight'|'hotel'} type - The type of booking spend to update.
   * @param {number} amount - The amount to add to the total spend.
   * @returns {Promise<void>}
   */
  async updateUserSpend(userId, type, amount) {
    const session = getSession();
    const spendField = type === 'flight' ? 'totalFlightSpend' : 'totalHotelSpend';
    try {
      await session.run(
        `MERGE (u:User {id: $userId})
         ON CREATE SET u.${spendField} = $amount
         ON MATCH SET u.${spendField} = u.${spendField} + $amount
         RETURN u`,
        { userId, amount }
      );
      console.log(`Updated ${type} spend for user ${userId} by ${amount}`);
    } catch (error) {
      console.error(`Error updating ${type} spend for ${userId}:`, error);
      throw error;
    } finally {
      session.close();
    }
  },

  /**
   * Adds or updates a user preference.
   * @param {string} userId - The ID of the user.
   * @param {string} relationshipType - The type of relationship (e.g., 'PREFERS_AIRLINE', 'PREFERS_TRAVEL_STYLE').
   * @param {string} targetNodeType - The label of the target node (e.g., 'Airline', 'TravelStyle').
   * @param {object} targetNodeProperties - Properties of the target node (e.g., {name: 'Emirates'}).
   * @returns {Promise<void>}
   */
  async addOrUpdatePreference(userId, relationshipType, targetNodeType, targetNodeProperties) {
    const session = getSession();
    try {
      const propertiesString = Object.keys(targetNodeProperties)
        .map(key => `${key}: $targetNodeProperties.${key}`)
        .join(', ');

      let parentNodeAlias;
      let parentNodeLabel;

      if (relationshipType.startsWith('PREFERS_FLIGHT') || relationshipType.startsWith('PREFERS_AIRLINE') || relationshipType.startsWith('PREFERS_CLASS')) {
        parentNodeAlias = 'fp';
        parentNodeLabel = 'FlightPreferences';
      } else if (relationshipType.startsWith('PREFERS_HOTEL') || relationshipType.startsWith('PREFERS_ROOM')) {
        parentNodeAlias = 'hp';
        parentNodeLabel = 'HotelPreferences';
      } else { // Default for general preferences like TravelStyle
        parentNodeAlias = 'u'; // Relationship directly from User node
        parentNodeLabel = 'User';
      }

      const query = `
        MERGE (u:User {id: $userId})
        MERGE (u)-[:HAS_${parentNodeLabel.toUpperCase()}]->(${parentNodeAlias}:${parentNodeLabel})
        MERGE (t:${targetNodeType} {${propertiesString}})
        MERGE (${parentNodeAlias})-[r:${relationshipType}]->(t)
        RETURN u, r, t
      `;
      await session.run(query, { userId, targetNodeProperties });
      console.log(`Added/Updated preference for user ${userId}: ${relationshipType} -> ${targetNodeType} with ${JSON.stringify(targetNodeProperties)}`);
    } catch (error) {
      console.error(`Error adding/updating preference for ${userId}:`, error);
      throw error;
    } finally {
      session.close();
    }
  },

  /**
   * Retrieves all preferences for a user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Array<object>>} - An array of preference objects.
   */
  async getUserPreferences(userId) {
    const session = getSession();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})
         OPTIONAL MATCH (u)-[:HAS_FLIGHT_PREFERENCES]->(fp:FlightPreferences)-[r_flight]->(p_flight)
         OPTIONAL MATCH (u)-[:HAS_HOTEL_PREFERENCES]->(hp:HotelPreferences)-[r_hotel]->(p_hotel)
         OPTIONAL MATCH (u)-[r_general]->(p_general)
         WHERE NOT (type(r_general) STARTS WITH 'HAS_FLIGHT_PREFERENCES' OR type(r_general) STARTS WITH 'HAS_HOTEL_PREFERENCES')
         RETURN type(r_flight) as relationshipTypeFlight, labels(p_flight) as targetNodeLabelsFlight, p_flight as targetNodePropertiesFlight,
                type(r_hotel) as relationshipTypeHotel, labels(p_hotel) as targetNodeLabelsHotel, p_hotel as targetNodePropertiesHotel,
                type(r_general) as relationshipTypeGeneral, labels(p_general) as targetNodeLabelsGeneral, p_general as targetNodePropertiesGeneral`,
        { userId }
      );

      const preferences = [];
      result.records.forEach(record => {
        // Flight preferences
        if (record.get('relationshipTypeFlight') && record.get('targetNodeLabelsFlight').length > 0) {
          preferences.push({
            relationshipType: record.get('relationshipTypeFlight'),
            targetNodeLabels: record.get('targetNodeLabelsFlight'),
            targetNodeProperties: record.get('targetNodePropertiesFlight').properties,
          });
        }
        // Hotel preferences
        if (record.get('relationshipTypeHotel') && record.get('targetNodeLabelsHotel').length > 0) {
          preferences.push({
            relationshipType: record.get('relationshipTypeHotel'),
            targetNodeLabels: record.get('targetNodeLabelsHotel'),
            targetNodeProperties: record.get('targetNodePropertiesHotel').properties,
          });
        }
        // General preferences (not flight or hotel grouping relationships)
        if (record.get('relationshipTypeGeneral') && record.get('targetNodeLabelsGeneral').length > 0) {
          preferences.push({
            relationshipType: record.get('relationshipTypeGeneral'),
            targetNodeLabels: record.get('targetNodeLabelsGeneral'),
            targetNodeProperties: record.get('targetNodePropertiesGeneral').properties,
          });
        }
      });
      return preferences.filter((pref, index, self) => 
        index === self.findIndex((t) => (
          t.relationshipType === pref.relationshipType && 
          JSON.stringify(t.targetNodeProperties) === JSON.stringify(pref.targetNodeProperties)
        ))
      ); // Filter out duplicates
    } catch (error) {
      console.error(`Error retrieving preferences for ${userId}:`, error);
      throw error;
    } finally {
      session.close();
    }
  },

  /**
   * Deletes a specific user preference.
   * @param {string} userId - The ID of the user.
   * @param {string} relationshipType - The type of relationship to delete.
   * @param {string} targetNodeType - The label of the target node.
   * @param {object} targetNodeProperties - Properties of the target node to match.
   * @returns {Promise<void>}
   */
  async deletePreference(userId, relationshipType, targetNodeType, targetNodeProperties) {
    const session = getSession();
    try {
      const query = `
        MATCH (u:User {id: $userId})-[r:${relationshipType}]->(t:${targetNodeType})
        WHERE t = $targetNodeProperties
        DELETE r
      `;
      await session.run(query, { userId, targetNodeProperties });
      console.log(`Deleted preference for user ${userId}: ${relationshipType} -> ${targetNodeType} with ${JSON.stringify(targetNodeProperties)}`);
    } catch (error) {
      console.error(`Error deleting preference for ${userId}:`, error);
      throw error;
    } finally {
      session.close();
    }
  },
};

module.exports = neo4jService;
