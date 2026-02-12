const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

let stores = [];


app.get("/stores", (req, res) => {
  res.json(stores);
});


app.post("/stores", (req, res) => {
  const storeName = "store-" + Date.now();
  const namespace = storeName;

  const helmCommand = `
    kubectl create namespace ${namespace} &&
    helm install ${storeName} ../charts/woocommerce -n ${namespace}
  `;

  exec(helmCommand, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr });
    }

    const newStore = {
      name: storeName,
      namespace: namespace,
      status: "Provisioned",
      createdAt: new Date().toLocaleString()
    };

    stores.push(newStore);
    res.json(newStore);
  });
});

app.delete("/stores/:name", (req, res) => {
  const storeName = req.params.name;

  const deleteCommand = `
    helm uninstall ${storeName} -n ${storeName} &&
    kubectl delete namespace ${storeName}
  `;

  exec(deleteCommand, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr });
    }

    stores = stores.filter(store => store.name !== storeName);
    res.json({ message: "Store deleted" });
  });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
