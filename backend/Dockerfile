FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install Maven
RUN apk add --no-cache maven

COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/expense-tracker-backend-0.0.1-SNAPSHOT.jar"]