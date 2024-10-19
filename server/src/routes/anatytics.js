const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const dotenv = require("dotenv");
const { AnalyticsRecord } = require("../models/dataAnalyticsModels");

dotenv.config();

const router = express.Router();

const analyseCsv = process.env.ANALYSE_CSV === "true";

if (analyseCsv) {
  console.log("Processing CSV file");
  const csvFilePath = "data.csv";

  let rowNumber = 0;
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", async (row) => {
      rowNumber += 1;

      const dateStringParts = row.Day.split("/");
      const year = Number(dateStringParts[2]);
      const month = Number(dateStringParts[1]) - 1;
      const day = Number(dateStringParts[0]);

      const date = new Date(year, month, day, 12);

      const data = {
        date,
        age: row.Age,
        gender: row.Gender,
        A: Number(row.A),
        B: Number(row.B),
        C: Number(row.C),
        D: Number(row.D),
        E: Number(row.E),
        F: Number(row.F),
      };

      try {
        // save record to DB
        const analyticsDataRecord = new AnalyticsRecord(data);
        await analyticsDataRecord.save();
      } catch (err) {
        console.error(`[Row number: ${rowNumber}] Error saving data:`, err);
      }
    })
    .on("end", () => {
      console.log("CSV file successfully processed and saved in DB");
    });
} else {
  console.log("[Skipped] Processing CSV file");
}

router.get("/filter", async (req, res) => {
  try {
    const { startDate, endDate, age, gender } = req.query;

    const filters = {};

    // date filter
    if (startDate && endDate) {
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
        return res.status(400).json({ error: "Invalid date provided" });
      }

      filters.date = { $gte: parsedStartDate, $lte: parsedEndDate };
    }

    // age filter
    const allowedAgeFilters = ["15-25", ">25"];
    if (age && allowedAgeFilters.includes(age)) {
      filters.age = age;
    }

    // gender filter
    const allowedGenderFilters = ["Male", "Female"];
    if (gender && allowedGenderFilters.includes(gender)) {
      filters.gender = gender;
    }

    const result = await AnalyticsRecord.aggregate([
      {
        $match: filters,
      },
      {
        $group: {
          _id: null,
          A: { $sum: "$A" },
          B: { $sum: "$B" },
          C: { $sum: "$C" },
          D: { $sum: "$D" },
          E: { $sum: "$E" },
          F: { $sum: "$F" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0,
      });
    }

    // sort results for displaying in order of features
    const sortedFeatures = Object.keys(result[0])
      .sort()
      .map((feature) => ({
        feature,
        timeTaken: result[0][feature],
      }));

    res.json(sortedFeatures);
  } catch (error) {
    console.error("[Analyics Error][filter API]", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the filtered data" });
  }
});

router.get("/featureTimeTrend/:feature", async (req, res) => {
  try {
    const { feature } = req.params;

    const allowedFeatures = ["A", "B", "C", "D", "E", "F"];

    if (!allowedFeatures.includes(feature)) {
      return res.status(400).json({ error: "Invalid feature" });
    }

    const result = await AnalyticsRecord.aggregate([
      {
        $group: {
          _id: "$date",
          totalTime: { $sum: `$${feature}` },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format the result as an array of { date, totalTime }
    const formattedResult = result.map((item) => ({
      date: item._id,
      timeSpent: item.totalTime,
    }));

    res.json(formattedResult);
  } catch (error) {
    console.error("[Analyics Error][featureTimeTrend API] ", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching feature time trend" });
  }
});

module.exports = router;
