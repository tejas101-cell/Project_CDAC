# Use OpenJDK 21
FROM eclipse-temurin:21-jdk-alpine

# Set working directory
WORKDIR /app

# Copy the jar file
# We assume the jar is built and located in target/
# The wildcard handles version changes
COPY target/*.jar app.jar

# Expose the service port (Default 8761 for Eureka, but configurable)
EXPOSE 8761

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
