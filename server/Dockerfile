FROM golang:1.16-alpine

# Copy application to the /app directory
COPY ./ /app

# Set working directory to /app
WORKDIR /app

# Copy go.mod and go.sum to /app
COPY go.mod ./
COPY go.sum ./

# Download go mod
RUN go mod download

RUN go build -o /docker-gs-ping

EXPOSE 5000

CMD [ "/docker-gs-ping" ]