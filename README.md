-> Urumi Store Provisioning Platform

-> Overview

Urumi Store Provisioning Platform is a Kubernetes-based multi-tenant WooCommerce provisioning system.  
It allows dynamic creation and deletion of WooCommerce stores using Helm charts, a Node.js backend API, and a React dashboard.

Each store runs in its own Kubernetes namespace with isolated WordPress and MySQL resources.



-> Architecture

Infrastructure:
- Kubernetes (Kind cluster)
- NGINX Ingress Controller
- Helm (for templated deployments)

Application Stack:
- WordPress + WooCommerce
- MySQL (StatefulSet with Persistent Volume)
- Node.js Backend (Store provisioning API)
- React Dashboard (Admin UI)



-> How It Works

1. User clicks "Create Store" in the dashboard.
2. Backend creates a new Kubernetes namespace.
3. Helm installs the WooCommerce chart inside that namespace.
4. WordPress and MySQL resources are deployed.
5. Store becomes accessible via Ingress or port-forward.
6. Store can be deleted from the dashboard, which removes the namespace and all associated resources.

Each store is fully isolated and independently manageable.


-> Project Structure

urumi-store-platform/
│
├── backend/            # Node.js API for provisioning
├── dashboard/          # React frontend dashboard
├── charts/
│   └── woocommerce/    # Helm chart for store deployment
├── scripts/            # Automation scripts
├── README.md
└── SYSTEM_DESIGN.md

-> Features

- Dynamic WooCommerce store provisioning
- Namespace-based multi-tenancy
- Helm-driven deployment automation
- MySQL StatefulSet with persistent storage
- Store deletion and cleanup
- React dashboard for store management
- Kubernetes-native architecture


-> Setup Instructions

-> 1. Verify Kubernetes Cluster

kubectl get pods -A


-> 2. Start Backend

cd backend 
npm install
npm start 

Backend runs on:
http://localhost:5000


-> 3. Start Dashboard

cd dashboard
npm install
npm start 

Dashboard runs on:
http://localhost:3000


-> 4. Access a Store

After creating a store from the dashboard:

Option 1 – Using Ingress:
http://<store-name>-woocommerce.localtest.me

Option 2 – Using Port Forward:
kubectl port-forward svc/<store-name>-woocommerce-wordpress -n <store-namespace> 8081:80

Then open:
http://localhost:8081


-> Store Lifecycle

Create Store:
- Namespace created
- Helm install executed
- WordPress + MySQL deployed

-> Delete Store:
- Namespace deleted
- All Kubernetes resources removed automatically


-> Design Decisions

- Isolation per store using namespaces
- Stateful database using PersistentVolume
- Infrastructure as Code using Helm templates
- REST API-based provisioning
- SaaS-style scalable architecture


-> Future Improvements

- Authentication and RBAC
- HTTPS with TLS certificates
- CI/CD integration
- Monitoring and logging
- Database backup automation

