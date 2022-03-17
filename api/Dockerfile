FROM golang:1.18rc1
WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

EXPOSE 7373

CMD ["go", "run", "cmd/api-server/main.go"]