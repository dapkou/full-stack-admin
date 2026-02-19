.PHONY: up up-all down reset stop-db reset-db restart-db logs logs-db logs-init logs-api be fe ps

# DB Only：啟動資料庫（含初始化建立 DB）
up:
	docker compose up -d sqlserver
	docker compose up -d --no-deps --force-recreate sqlserver-init

# 後端 + DB（整合測試）
up-all:
	docker compose up -d --build

# 關閉所有服務（保留 volume）
down:
	docker compose down

# 關閉所有服務（清除 volume，資料會消失）
reset:
	docker compose down -v

# 只停止 DB（不清資料）
stop-db:
	docker compose stop sqlserver
	docker compose rm -f sqlserver-init || true

# 只重置 DB（清除 DB volume，資料會消失）
reset-db:
	docker compose rm -sfv sqlserver sqlserver-init
	docker volume rm -f full-stack_sqlserver_data || true

# 重啟資料庫（不清 volume）+ 重跑 init
restart-db:
	docker compose restart sqlserver
	docker compose rm -f sqlserver-init || true
	docker compose up -d --no-deps --force-recreate sqlserver-init

# 快速查看容器狀態
ps:
	docker compose ps

# Logs
logs-db:
	docker logs -f sqlserver

logs-init:
	docker logs -f sqlserver-init

logs-api:
	docker logs -f backend-api

logs:
	docker compose logs -f --tail=200

# 啟動後端（本機）
be:
	cd backend && poetry run uvicorn src.main:app --reload

# 啟動前端
fe:
	cd frontend && npm run dev