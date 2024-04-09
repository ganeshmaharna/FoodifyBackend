import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Define a route to fetch data from the provided URL
app.use(cors());
app.get("/fetch-data", async (req, res) => {
  try {
    const url =
      "https://thingproxy.freeboard.io/fetch/https://www.swiggy.com/dapi/restaurants/list/v5?lat=20.32351&lng=85.8172637&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING";
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
      },
    });

    // Check if the response status is 200 (OK)
    if (response.ok) {
      const data = await response.json();
      //   console.log("This is data", data);
      res.json(data);
    } else {
      console.error("Error fetching data:", response.statusText);
      res.status(response.status).send("Error fetching data");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

// Define a route to fetch restaurant menus from Swiggy API
app.get("/fetch-restaurant-menu/:resId", async (req, res) => {
  const { resId } = req.params;
  //   console.log("This is resId", resId);
  try {
    const url = `https://thingproxy.freeboard.io/fetch/https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=20.32351&lng=85.8172637&restaurantId=${resId}&catalog_qa=undefined&submitAction=ENTER`;
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch restaurant menu");
    }
    const jsonData = await response.json();
    // Process jsonData as needed
    res.json(jsonData);
  } catch (error) {
    console.error("Error fetching restaurant menu:", error);
    res.status(500).send("Error fetching restaurant menu");
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
