require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const CORS = require("./app/util/corsOptions");
const multer = require("multer");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");
const fs = require("fs");
const json2csv = require("json2csv").parse;
const csvParser = require("csv-parser");

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.databaseURL,
});
//create the app for rest api using express
const app = express();
var corsOptions = {
  origin: (origin, callback) => {
    // Check if the origin is in the list of allowed origins
    if (CORS.allowedCorsList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "*",
  allowedHeaders: "*",
  exposedHeaders: "*",
};
// use the cors body parser in express app
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
const db = getFirestore();
app.use(bodyParser.json()); // parsing requesting content type to application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// making upload folder static for accessing
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Welcome to Node js app for heartbug technical challenge",
  });
});
app.post("/task", async (req, res) => {
  try {
    const data = req.body;
    delete data.id;
    delete data.updatedAt;
    const _data = data;
    const docRef = await db.collection("tasks").add(_data);
    return res.status(201).send({
      status: "ok",
      message: "Data saved successfull",
      data: { id: docRef.id },
    });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
});

// get all
app.get("/task", async (req, res) => {
  try {
    // Extract filter parameters from the request query
    const { title, status, priority, dueDate } = req.query;

    // Start with the tasks collection reference
    let tasksQuery = db.collection("tasks");

    // Apply filters based on the provided criteria
    if (title) {
      tasksQuery = tasksQuery.where("title", "==", title);
    }

    if (status) {
      tasksQuery = tasksQuery.where("status", "==", status);
    }

    if (priority) {
      tasksQuery = tasksQuery.where("priority", "==", priority);
    }

    if (dueDate) {
      tasksQuery = tasksQuery.where("dueDate", "==", dueDate);
    }

    // Fetch the filtered data
    const tasksSnapshot = await tasksQuery.get();

    // Map the results to an array of task objects
    const tasks = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Delay the response by 3 seconds
    setTimeout(() => {
      return res.status(200).send({
        status: "ok",
        message: "Filtered data retrieved successfully",
        data: tasks,
      });
    }, 2000);
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
});

// delete
app.delete("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const taskRef = db.collection("tasks").doc(id);
    const doc = await taskRef.get();
    if (!doc.exists) {
      return res.status(404).send({
        status: "error",
        message: "Car not found",
      });
    }

    // Delete the document
    await taskRef.delete();

    return res.status(200).send({
      status: "ok",
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
});

// update
app.put("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    // Reference to the specific document in the 'cars' collection
    const taskRef = db.collection("tasks").doc(id);

    // Check if the document exists
    const doc = await taskRef.get();
    if (!doc.exists) {
      return res.status(404).send({
        status: "error",
        message: "Car not found",
      });
    }

    // Update the document with the new data
    await taskRef.update(updatedData);

    return res.status(200).send({
      status: "ok",
      message: "Task updated successfully",
    });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
});

const upload = multer({ dest: "uploads/" });

app.post("/upload-csv", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ status: "error", message: "No file uploaded" });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        for (let car of results) {
          let docRef;

          // Check if the car object has an 'id' field
          if (car.id) {
            docRef = db.collection("cars").doc(car.id);
          } else {
            // Generate a new document reference with a unique ID
            docRef = db.collection("cars").doc();
            // Set the generated ID in the car object
            car.id = docRef.id;
          }

          // Save the document with the provided or generated ID
          await docRef.set(car);
        }

        res.status(200).send({
          status: "ok",
          message: "CSV uploaded and data saved to Firestore",
        });
      } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
      }
    });
});

app.get("/download-csv", async (req, res) => {
  try {
    const snapshot = await db.collection("cars").get();
    const cars = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const csv = json2csv(cars);
    res.setHeader("Content-disposition", "attachment; filename=cars.csv");
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

const PORT = process.env.PORT || 8082; //setting up the ports for application
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
