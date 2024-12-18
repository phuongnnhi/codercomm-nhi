import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Card,
  Box,
  Pagination,
  Grid,
  Container,
  Tabs,
  Tab,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getFriendRequests, getOutgoingRequests } from "./friendSlice";
import UserCard from "./UserCard";
import SearchInput from "../../components/SearchInput";

function FriendRequests() {
  const [filterName, setFilterName] = useState("");
  const [page, setPage] = React.useState(1);
  const [tab, setTab] = useState("incoming");

  const { currentPageUsers, usersById, totalUsers, totalPages } = useSelector(
    (state) => state.friend
  );
  const users = currentPageUsers.map((userId) => usersById[userId]);
  const dispatch = useDispatch();

  const handleSubmit = (searchQuery) => {
    setFilterName(searchQuery);
  };

  useEffect(() => {
    if (tab === "incoming") {
      dispatch(getFriendRequests({ filterName, page }));
    } else {
      dispatch(getOutgoingRequests({ filterName, page }));
    }
  }, [filterName, page, tab, dispatch]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setPage(1); // Reset to page 1 when switching tabs
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Friend Requests
      </Typography>
      <Card sx={{ p: 3 }}>
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Incoming Requests" value="incoming" />
          <Tab label="Sent Requests" value="outgoing" />
        </Tabs>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems="center">
            <SearchInput handleSubmit={handleSubmit} />
            <Box sx={{ flexGrow: 1 }} />
            <Typography
              variant="subtitle"
              sx={{ color: "text.secondary", ml: 1 }}
            >
              {totalUsers > 1
                ? `${totalUsers} requests found`
                : totalUsers === 1
                ? `${totalUsers} request found`
                : "No request found"}
            </Typography>

            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, page) => setPage(page)}
            />
          </Stack>
        </Stack>

        <Grid container spacing={3} my={1}>
          {users.map((user) => (
            <Grid key={user._id} item xs={12} md={4}>
              <UserCard profile={user} />
            </Grid>
          ))}
        </Grid>
      </Card>
    </Container>
  );
}

export default FriendRequests;
