const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

const HELM_PATH = "/home/saransh/urumi-store-platform/charts/woocommerce";

// Health check
app.get("/", (req, res) => {
  res.send("Store Provisioning Backend Running");
});

// Create Store
app.post("/stores", (req, res) => {
  const name = req.body.name;

  if (!name) {
    return res.status(400).json({ error: "Store name required" });
  }

  const command = `
    kubectl create namespace ${name} || true &&
    helm install ${name} ${HELM_PATH} -n ${name}
  `;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr });
    }
    res.json({ message: "Store provisioning started", output: stdout });
  });
});

// List Stores
app.get("/stores", (req, res) => {
  exec("kubectl get namespaces -o json", (err, stdout) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const data = JSON.parse(stdout);
    const stores = data.items
      .map(ns => ns.metadata.name)
      .filter(name => name.startsWith("store"));

    res.json(stores);
  });
});

// Delete Store
app.delete("/stores/:name", (req, res) => {
  const name = req.params.name;

  const command = `
    helm uninstall ${name} -n ${name} &&
    kubectl delete namespace ${name}
  `;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr });
    }
    res.json({ message: "Store deleted" });
  });
});

app.listen(4000, () => {
  console.log("Backend running on port 4000");
});
