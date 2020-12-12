# Tutorial: Simple Session Sharing for JHipster with Spring Session

This repository contains all the code for testing Spring Session in a JHipster microservices architecture, with Okta authentication and HAProxy load balancer.

**Prerequisites:**
Prerequisites:
- [Java 11](https://adoptopenjdk.net/)
- [JHipster 6.10.5](https://www.jhipster.tech/installation/)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Okta CLI](https://github.com/okta/okta-cli)


## Getting Started

To run this example, run the following commands:

```bash
git clone https://github.com/oktadeveloper/okta-spring-session-redis-example.git
```

## Create the OIDC Application in Okta

Register for a free developer account with the following simple commands using the [Okta CLI](https://github.com/okta/okta-cli), in the project root folder:

```shell
okta register
```
Provide the required information. Once you register, create a client application in Okta with the following command:

```shell
okta apps create
```

You will be prompted to select the following options:
- Type of Application: **1: Web**
- Type of Application (again): **3: JHipster**

The application configuration will be generated in the file `.okta.env` and it will look like this:

```shell
export SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_OIDC_CLIENT_SECRET="{clientSecret}"
export SPRING_SECURITY_OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER_URI="{yourOrgUrl}/oauth2/default"
export SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_OIDC_CLIENT_ID="{clientId}"
```


Create a file `docker-compose/.env` and set the value of the `OKTA_OAUTH_*` environment variables for Docker Compose, copy the values from `.okta.env`:

```shell
OKTA_OAUTH2_ISSUER={yourOrgUrl}/oauth2/default
OKTA_OAUTH2_CLIENT_ID={clientId}
OKTA_OAUTH2_CLIENT_SECRET={clientSecret}
```

## Run with Docker Compose

Go through each application `store`, `product`, `invoice`, `notification` and build the container images with Maven:

```shell
./mvnw -ntp -Pprod verify jib:dockerBuild
```

Run the services with Docker Compose:

```shell
cd docker-compose
docker-compose up
```

The JHipster registry will log the following message once it is ready:
```
jhipster-registry_1     | 2020-11-09 16:03:47.233  INFO 6 --- [           main] i.g.j.registry.JHipsterRegistryApp       :
jhipster-registry_1     | ----------------------------------------------------------
jhipster-registry_1     | 	Application 'jhipster-registry' is running! Access URLs:
jhipster-registry_1     | 	Local: 		http://localhost:8761/
jhipster-registry_1     | 	External: 	http://172.18.0.2:8761/
jhipster-registry_1     | 	Profile(s): 	[composite, dev, swagger, oauth2]
jhipster-registry_1     | ----------------------------------------------------------
jhipster-registry_1     | 2020-11-09 16:03:47.234  INFO 6 --- [           main] i.g.j.registry.JHipsterRegistryApp       :
jhipster-registry_1     | ----------------------------------------------------------
jhipster-registry_1     | 	Config Server: 	Connected to the JHipster Registry running in Docker
jhipster-registry_1     | ----------------------------------------------------------
```

You can sign in to http://localhost:8761/ with the JHipster admin user and password, to check if all services are up.

Once all services are up, access the store at http://localhost:8080 and sign in with the Okta user.
