FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN cp src/main/resources/application.properties.example src/main/resources/application.properties
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/appointment-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "echo \"DEBUG: SPRING_DATASOURCE_URL=$SPRING_DATASOURCE_URL\" && echo \"DEBUG: SPRING_DATASOURCE_USERNAME=$SPRING_DATASOURCE_USERNAME\" && exec java -jar app.jar"]
