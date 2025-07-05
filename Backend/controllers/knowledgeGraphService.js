// In Backend/controllers/knowledgeGraphService.js

const neo4j = require('neo4j-driver');

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;

// This is the security feature: only create the driver if the credentials exist.
let driver;
if (uri && user && password) {
  driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  console.log("🪢  Neo4j driver initialized.");
} else {
  console.warn("⚠️  Neo4j credentials not found in .env file. Knowledge Graph features will be disabled.");
}

const saveUserPreference = async (userId, preferenceType, preferenceValue) => {
  // If the driver wasn't created, do nothing.
  if (!driver) {
    console.log("Neo4j is not configured. Skipping save preference.");
    return;
  }

  const session = driver.session();
  try {
    // This query creates a preference and links it to the user
    await session.run(
      `MERGE (u:User {id: $userId})
       MERGE (p:Preference {type: $preferenceType, value: $preferenceValue})
       MERGE (u)-[:HAS_PREFERENCE]->(p)`,
      { userId, preferenceType, preferenceValue }
    );
    console.log(`Saved preference for user ${userId}: ${preferenceType} = ${preferenceValue}`);
  } finally {
    await session.close();
  }
};

const getUserPreferences = async (userId) => {
  // If the driver wasn't created, return an empty array.
  if (!driver) {
    console.log("Neo4j is not configured. Skipping get preferences.");
    return [];
  }

  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (u:User {id: $userId})-[:HAS_PREFERENCE]->(p:Preference) RETURN p.type as type, p.value as value',
      { userId }
    );
    return result.records.map(record => ({
      type: record.get('type'),
      value: record.get('value'),
    }));
  } finally {
    await session.close();
  }
};

// We don't need to export the driver itself anymore.
module.exports = { saveUserPreference, getUserPreferences };