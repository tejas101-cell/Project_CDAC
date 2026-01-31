import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'http://localhost:8085',
    realm: 'ewaste-realm',
    clientId: 'ewaste-frontend'
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;