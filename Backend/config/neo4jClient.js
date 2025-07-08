const neo4j = require('neo4j-driver');

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USERNAME || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

driver.verifyConnectivity()
  .then(() => {
    console.log('Neo4j Driver connected successfully');
  })
  .catch((error) => {
    console.error('Neo4j Driver connection failed:', error);
  });

const getSession = () => driver.session();

module.exports = { getSession, driver };
