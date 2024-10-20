import { Typography, Button, Container, useMediaQuery } from "@mui/material";
import { BarChart, blueberryTwilightPalette } from "@mui/x-charts";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../config/axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LineChart from "../components/LineChart";
import Filters from "../components/Filters";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(window.location.search);
  const location = useLocation();

  const { logout } = useContext(AuthContext);

  const [barData, setBarData] = useState([]);
  const [loadingBarData, setLoadingBarData] = useState(false);
  const [lineData, setLineData] = useState([]);

  const [ageFilter, setAgeFilter] = useState(
    searchParams.get("ageFilter") || "All"
  );
  const [genderFilter, setGenderFilter] = useState(
    searchParams.get("genderFilter") || "All"
  );
  const [startDate, setStartDate] = useState(
    new Date(searchParams.get("startDate") || "10-04-2022")
  );
  const [endDate, setEndDate] = useState(
    new Date(searchParams.get("endDate") || "10-29-2022")
  );

  const feature = useRef("");

  useEffect(() => {
    const savedFilters = localStorage.getItem("analytics_filters");
    if (savedFilters && searchParams.size === 0) {
      navigate({ search: savedFilters });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        setLoadingBarData(true);
        setBarData([]);

        if (startDate?.setHours) startDate.setHours(10, 0);
        if (endDate?.setHours) endDate.setHours(23, 0);

        const response = await axios.get("analytics/filter", {
          params: {
            age: (ageFilter !== "All" && ageFilter) || undefined,
            gender: (genderFilter !== "All" && genderFilter) || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          },
        });

        if (response.data) {
          setBarData(response.data);
        }
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      } finally {
        setLoadingBarData(false);
      }
    };

    fetchFilteredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const onBarClick = async (e, barItem) => {
    feature.current = barData[barItem.dataIndex].feature;
    try {
      const response = await axios.get(
        `analytics/featureTimeTrend/${feature.current}`
      );
      if (response.data) {
        setLineData(response.data);
      }
    } catch (error) {
      console.error("Error fetching time trend data:", error);
    }
  };

  const isLargeScreen = useMediaQuery("(min-width:1024px)");
  const isMediumScreen = useMediaQuery("(min-width:650px)");

  return (
    <Container sx={{ px: 1, py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>

      <Filters
        {...{
          ageFilter,
          genderFilter,
          startDate,
          endDate,
          setAgeFilter,
          setGenderFilter,
          setStartDate,
          setEndDate,
        }}
      />

      <Typography
        variant="caption"
        display="inline-block"
        textAlign="center"
        className="w-full"
      >
        At present, we only have data from <b>4/10/2022</b> to <b>29/10/2022</b>
      </Typography>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          rowGap: "4rem",
          marginTop: "4rem",
        }}
      >
        <div
          style={{
            minWidth: "21rem",
            width: isLargeScreen ? "35%" : isMediumScreen ? "80%" : "90%",
            padding: "5px 0px",
          }}
        >
          <Typography variant="h6">Features Total Time Spent</Typography>
          <BarChart
            loading={loadingBarData}
            dataset={barData}
            series={[{ dataKey: "timeTaken", label: "Feature" }]}
            layout="horizontal"
            grid={{ vertical: true }}
            onItemClick={onBarClick}
            height={300}
            style={{ height: "100%" }}
            yAxis={[
              {
                scaleType: "band",
                dataKey: "feature",
                reverse: true,
                colorMap: {
                  type: "ordinal",
                  colors: blueberryTwilightPalette(),
                },
              },
            ]}
            xAxis={[
              {
                label: "total time spent",
              },
            ]}
          />
        </div>

        <div
          style={{
            width: isLargeScreen ? "60%" : isMediumScreen ? "80%" : "90%",
            minWidth: "20rem",
            padding: "5px 3px",
          }}
        >
          <Typography variant="h6">
            Time Trend for Feature{" "}
            <span style={{ color: "#1976d2", fontWeight: 600 }}>
              {feature.current}
            </span>
          </Typography>
          <LineChart lineData={lineData} />
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={logout}
          sx={{ marginTop: "3rem" }}
        >
          Logout
        </Button>
      </div>
    </Container>
  );
};

export default Dashboard;
