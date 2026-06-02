# Hướng Dẫn Khởi Chạy Dự Án Nhanh 🚀

## Cách 1: Chạy bằng Docker (Nhanh nhất) 🐳
Chạy lệnh duy nhất tại thư mục gốc để khởi động Frontend, Backend, Redis và Kafka:
```bash
docker compose up -d
```
*Để dừng dự án:* `docker compose down`

---

## Cách 2: Chạy bằng Kubernetes (Dành cho Dev/Ops) ☸️

**Bước 1: Khởi động Minikube & Cài đặt hạ tầng cơ bản**
```bash
minikube start --memory=4096 --cpus=4
kubectl create ns kafka && helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-kafka bitnami/kafka -n kafka --version 29.3.14
```
*(Nếu cần ArgoCD & Prometheus, cài thêm theo document cũ).*

**Bước 2: Mở Port-forward (Chạy mỗi lệnh trên 1 tab Terminal riêng)**
```bash
kubectl port-forward svc/frontend-svc -n wdp301 3000:3000
kubectl port-forward svc/backend-svc -n wdp301 4000:4000
kubectl port-forward svc/my-kafka -n kafka 9092:9092
```

**Bước 3: Chạy Code Backend (Ngoại tuyến)**
Nếu bạn đang dev code Backend cục bộ và muốn gọi DB/Kafka trên K8s:
```bash
cd backend
npm install
npm run dev:all
```
*(Đảm bảo đã chạy port-forward Kafka ra `localhost:9092` ở bước 2).*

**Khi làm việc xong:** Chạy `minikube stop` để giải phóng RAM.
