FROM golang:1.21-alpine

RUN export GOPROXY=direct
WORKDIR $GOPATH/src/github.com/lol/app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN go build -o ./build/server ./cmd/server/main.go