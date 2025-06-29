# Ultra-simple development commands

.PHONY: help install dev prod local frontend backend clean

help:
	@echo "Available commands:"
	@echo "  install    - Install all dependencies"
	@echo "  dev        - Start development (Docker with hot reload)"
	@echo "  prod       - Start production (Docker)"
	@echo "  local      - Instructions for local development"
	@echo "  clean      - Clean up Docker"

install:
	@if [ ! -f .env ]; then cp .env.example .env; echo "Created .env from .env.example - please edit with your credentials"; fi
	cd frontend && npm install
	cd backend && pip install -r requirements-dev.txt

dev:
	@if [ ! -f .env ]; then echo "Run 'make install' first to create .env file"; exit 1; fi
	docker-compose up --build

prod:
	@if [ ! -f .env ]; then echo "Run 'make install' first to create .env file"; exit 1; fi
	docker-compose -f docker-compose.yml up --build -d

local:
	@echo "For local development without Docker:"
	@echo ""
	@echo "Terminal 1 (Backend):"
	@echo "  cd backend"
	@echo "  pip install -r requirements-dev.txt"
	@echo "  uvicorn app.main:app --reload"
	@echo ""
	@echo "Terminal 2 (Frontend):"
	@echo "  cd frontend"
	@echo "  npm install"
	@echo "  npm run dev"
	@echo ""
	@echo "Make sure your .env file has the right credentials!"

clean:
	docker-compose down
	docker system prune -f