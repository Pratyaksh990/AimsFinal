import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

function AttendancePieChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const aa = sessionStorage.getItem("data");
  const xx = JSON.parse(aa);
  const new1 = xx[xx.length - 1].attendance_summary;

  function calc75(present, total) {
    const temp1 = present;
    var temp = (present / total) * 100;
    while (temp < 75) {
      total++;
      present++;
      temp = (present / total) * 100;
    }
    return present - temp1;
  }

  function leavefor75(present, total) {
    const temp1 = present;
    var temp = (present / total) * 100;
    while (temp > 75) {
      total++;
      present--;
      temp = (present / total) * 100;
    }
    return temp1 - present;
  }

  const lectureneedfor75 = calc75(new1.Present, new1.Total);
  const leactureleavefor75 = leavefor75(new1.Present, new1.Total);

  const COLORS = ["#a0d468", "#ff9f89"]; // Light green for Present, Light red for Absent
  const data = [
    { name: "Present", value: new1.Present },
    { name: "Absent", value: new1.Total - new1.Present },
  ];

  // Render customized label for the center of the pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={isMobile ? 12 : 14}
      >
        {`${data[index].name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Typography
            variant="h6"
            align="center"
            fontSize={24}
            fontWeight={550}
          >
            Attendance Summary
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? 70 : 80}
                outerRadius={isMobile ? 100 : 120}
                labelLine={false}
                label={renderCustomizedLabel}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
      <Grid item xs={12} md={12} mb={4}>
        <TableContainer
          component={Paper}
          style={{ maxWidth: "100%", margin: "auto" }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell align="right">Count</TableCell>
                <TableCell align="right">For 75% [L]</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Present</TableCell>
                <TableCell align="right">{new1.Present}</TableCell>
                <TableCell align="right">{lectureneedfor75}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Absent</TableCell>
                <TableCell align="right">{new1.Total - new1.Present}</TableCell>
                <TableCell align="right">{leactureleavefor75}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell align="right">{new1.Total}</TableCell>
                <TableCell align="right">
                  {leactureleavefor75 - lectureneedfor75}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
}

export default AttendancePieChart;
