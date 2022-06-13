FROM amazoncorretto:17
WORKDIR /opt/service
# JAR is copied in by build.sh
COPY ./service.jar ./service.jar
CMD java -jar ./service.jar
