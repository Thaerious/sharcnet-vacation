.PHONY: install-docker build up down restart logs shell clean

install-docker:
	dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
	dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
	systemctl enable --now docker
	@echo "Docker installed. You may need to log out and back in if adding your user to the docker group."

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

shell:
	docker compose exec app sh

clean:
	docker compose down -v --rmi local
