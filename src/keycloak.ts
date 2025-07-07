import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080', // Keycloak server URL
  realm: 'bitlabs',             // Your realm name
  clientId: 'employee-management',
});

export default keycloak;
