# Neo4j Functionalities in ByteBound AI Travel Planner

This document outlines the integration and usage of Neo4j, a graph database, within the ByteBound AI Travel Planner backend. Neo4j is used to store and manage user preferences and behavioral data, enabling personalized recommendations and analytics.

## 1. Neo4j Client Configuration (`Backend/config/neo4jClient.js`)

This file is responsible for establishing and managing the connection to the Neo4j database.

*   **Purpose:** Provides a centralized configuration for Neo4j connectivity.
*   **Key Components:**
    *   `neo4j-driver`: The official Neo4j JavaScript driver is used to interact with the database.
    *   **Environment Variables:** Connects using `NEO4J_URI`, `NEO4J_USERNAME`, and `NEO4J_PASSWORD` from environment variables, ensuring secure and flexible deployment.
    *   `driver`: Initializes a Neo4j driver instance.
    *   `getSession()`: A utility function that returns a new Neo4j session, which is used to execute Cypher queries.
*   **Connection Verification:** Includes logic to verify connectivity upon startup, logging success or failure.

## 2. Neo4j Service (`Backend/services/neo4jService.js`)

This service encapsulates all the core CRUD (Create, Read, Update, Delete) operations related to user preferences and booking statistics in Neo4j. It interacts with the Neo4j database using Cypher queries.

*   **`createUserNode(userId)`:**
    *   **Purpose:** Ensures a `User` node exists for a given `userId`. If the node doesn't exist, it creates it and initializes properties like `flightBookingsCount`, `hotelBookingsCount`, `totalFlightSpend`, and `totalHotelSpend` to zero. It also creates `FlightPreferences` and `HotelPreferences` nodes linked to the user.
    *   **Cypher Query:**
        ```cypher
        MERGE (u:User {id: $userId})
        ON CREATE SET u.flightBookingsCount = 0, u.hotelBookingsCount = 0, u.totalFlightSpend = 0.0, u.totalHotelSpend = 0.0
        MERGE (u)-[:HAS_FLIGHT_PREFERENCES]->(fp:FlightPreferences)
        MERGE (u)-[:HAS_HOTEL_PREFERENCES]->(hp:HotelPreferences)
        RETURN u
        ```

*   **`updateBookingCounts(userId, type)`:**
    *   **Purpose:** Increments either the `flightBookingsCount` or `hotelBookingsCount` property on the `User` node.
    *   **Cypher Query:**
        ```cypher
        MERGE (u:User {id: $userId})
        ON CREATE SET u.<counterField> = 1
        ON MATCH SET u.<counterField> = u.<counterField> + 1
        RETURN u
        ```
        (Where `<counterField>` is dynamically set to `flightBookingsCount` or `hotelBookingsCount`).

*   **`updateUserSpend(userId, type, amount)`:**
    *   **Purpose:** Updates the `totalFlightSpend` or `totalHotelSpend` property on the `User` node by adding the specified `amount`.
    *   **Cypher Query:**
        ```cypher
        MERGE (u:User {id: $userId})
        ON CREATE SET u.<spendField> = $amount
        ON MATCH SET u.<spendField> = u.<spendField> + $amount
        RETURN u
        ```
        (Where `<spendField>` is dynamically set to `totalFlightSpend` or `totalHotelSpend`).

*   **`addOrUpdatePreference(userId, relationshipType, targetNodeType, targetNodeProperties)`:**
    *   **Purpose:** Creates or updates a user preference by establishing a relationship from the `User` node (or a related preference grouping node like `FlightPreferences` or `HotelPreferences`) to a `targetNode`.
    *   **Relationship Types:** Examples include `PREFERS_AIRLINE`, `PREFERS_CLASS`, `PREFERS_HOTEL_CHAIN`, `PREFERS_HOTEL_AMENITY`, `PREFERS_HOTEL_TYPE`, `PREFERS_TRAVEL_STYLE`.
    *   **Cypher Query Structure:**
        ```cypher
        MERGE (u:User {id: $userId})
        MERGE (u)-[:HAS_<PARENT_NODE_LABEL>]->(<parentNodeAlias>:<ParentNodeLabel>) // Optional, for grouping
        MERGE (t:<TargetNodeType> {<targetNodeProperties>})
        MERGE (<parentNodeAlias>)-[r:<relationshipType>]->(t)
        RETURN u, r, t
        ```
        (The `parentNodeAlias` and `parentNodeLabel` are dynamically determined based on the `relationshipType` to group preferences logically).

*   **`getUserPreferences(userId)`:**
    *   **Purpose:** Retrieves all preferences associated with a given `userId`, including flight, hotel, and general travel style preferences.
    *   **Cypher Query:** Uses `MATCH` and `OPTIONAL MATCH` to traverse relationships from the `User` node to various preference nodes.
    *   **Return Value:** An array of preference objects, each containing `relationshipType`, `targetNodeLabels`, and `targetNodeProperties`. Duplicates are filtered out.

*   **`deletePreference(userId, relationshipType, targetNodeType, targetNodeProperties)`:**
    *   **Purpose:** Deletes a specific preference relationship and its associated target node (if it's no longer connected to any other nodes).
    *   **Cypher Query:**
        ```cypher
        MATCH (u:User {id: $userId})-[r:<relationshipType>]->(t:<targetNodeType>)
        WHERE t = $targetNodeProperties
        DELETE r
        ```

## 3. Integration Points in Controllers

The `neo4jService` is integrated into various parts of the application to manage user data:

*   **`Backend/controllers/userController.js`:**
    *   `createUserNode` is called when a new user is registered to initialize their Neo4j profile.
    *   `addOrUpdatePreference` is used to allow users to explicitly set or update their preferences (e.g., via a user profile settings page).
    *   `getUserPreferences` is used to retrieve a user's stored preferences.

*   **`Backend/controllers/flightBookingOrchestrator.js`:**
    *   After successful flight and hotel bookings, `updateBookingCounts` is called to increment the respective booking counters on the user's node.
    *   `addOrUpdatePreference` is used to store *implicit* preferences based on the actual bookings (e.g., the airline or hotel chain booked).
    *   `updateUserSpend` is called to track the total amount spent on flights and hotels.

*   **`Backend/controllers/activitySuggestionService.js`:**
    *   `getUserPreferences` is called to fetch `PREFERS_TRAVEL_STYLE` preferences from Neo4j. These preferences are then incorporated into the Tavily search query to generate more personalized activity recommendations.

## 4. API Routes (`Backend/routes/userRoutes.js`)

The following API routes are exposed for managing user preferences, which are handled by `userController.js` and interact with Neo4j:

*   **`PUT /api/users/preferences`:** Updates user preferences.
*   **`GET /api/users/preferences`:** Retrieves user preferences.

## 5. Benefits of Neo4j Integration

*   **Personalization:** Enables the system to build rich user profiles and provide highly personalized recommendations based on explicit preferences and implicit behavior.
*   **Contextual Understanding:** The graph structure allows for complex queries to understand relationships between users, their preferences, and past actions, leading to deeper insights.
*   **Flexibility:** Easily extensible to add new types of preferences or relationships without major schema migrations.
*   **Analytics:** Provides a powerful foundation for analyzing user behavior and travel patterns.