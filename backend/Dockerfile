FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy the pom and wrappers to cache dependencies
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# FIX: Explicitly copy your source code and resources into the image context
COPY src ./src

# Build the jar inside the container clean environment
RUN ./mvnw clean package -DskipTests

EXPOSE 8081
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
