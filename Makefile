GIT_VERSION ?= $(shell git describe --abbrev=8 --tags --always --dirty)
CONTAINER_REGISTRY ?= ghcr.io/francoposa
REPOSITORY ?= echo-server-ui
SERVICE_NAME ?= echo-server-ui

.PHONY: build
build:
	@ifndef NEXT_PUBLIC_ECHO_SERVER_API_BASE_URL
		$(error NEXT_PUBLIC_ECHO_SERVER_API_BASE_URL is not set)
	@endif

	docker build --build-arg=GIT_VERSION=$(GIT_VERSION) -t $(CONTAINER_REGISTRY)/$(REPOSITORY)/$(SERVICE_NAME) -f ./Dockerfile .
	docker tag $(CONTAINER_REGISTRY)/$(REPOSITORY)/$(SERVICE_NAME) $(CONTAINER_REGISTRY)/$(REPOSITORY)/$(SERVICE_NAME):$(GIT_VERSION)
	docker tag $(CONTAINER_REGISTRY)/$(REPOSITORY)/$(SERVICE_NAME) $(CONTAINER_REGISTRY)/$(REPOSITORY)/$(SERVICE_NAME):latest

.PHONY: push
push: build
	docker push $(CONTAINER_REGISTRY)/$(REPOSITORY)/$(SERVICE_NAME):$(GIT_VERSION)
	docker push $(CONTAINER_REGISTRY)/$(REPOSITORY)/$(SERVICE_NAME):latest
