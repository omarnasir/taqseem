VERSION=0.0.1
APPNAME=taqseem

.PHONY: release
release:
	docker build -f ./backend/Dockerfile --target prod -t ${APPNAME}:$(VERSION) ./backend;

.PHONY: dev
dev:
	docker compose --profile dev up --build -d;

.PHONY: test
test:
	docker compose --profile test up --build -d;

.PHONY: clean
clean:
	docker container prune -f \
	&& docker images --quiet --filter=dangling=true | xargs --no-run-if-empty docker rmi;
