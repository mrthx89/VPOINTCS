"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Menu as MenuIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  WhatsApp as WhatsAppIcon,
  Message as MessageIcon,
  Send as SendIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "@mui/icons-material";
import { useWebSocket } from "./hooks/useWebSocket";

export default function Home() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { socket, isConnected } = useWebSocket();
  const [stats, setStats] = useState({
    incomingMessages: 0,
    outgoingMessages: 0,
    activeCustomers: 0,
    incomingMessagesChange: 5,
    outgoingMessagesChange: -2,
    activeCustomersChange: 8,
  });
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "stats") {
            setStats(data.stats);
          } else if (data.type === "recentMessages") {
            setRecentMessages(
              data.messages.map((msg: any, index: number) => ({
                id: index,
                timestamp: new Date(msg.timestamp).toLocaleString(),
                sender: msg.sender,
                message: msg.text,
              }))
            );
          }
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      };
    }
  }, [socket]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const menuItems = [
    { text: "Chat", icon: <ChatIcon />, path: "/chat" },
    { text: "Customers", icon: <PeopleIcon />, path: "/customers" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            VPoint App Customer Service
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        classes={{
          paper: "elevation-1",
        }}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  router.push(item.path);
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon sx={{ color: "primary.main" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="lg">
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", justifyContent: "flex-start" }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              sx={{
                minWidth: { xs: "100%", sm: "250px" },
                maxWidth: { xs: "100%", sm: "300px" },
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <WhatsAppIcon
                      color={isConnected ? "success" : "error"}
                      sx={{ mr: 1, fontSize: 32 }}
                    />
                    <Typography variant="h6">Status WhatsApp</Typography>
                  </Box>
                  <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: isConnected ? "success.light" : "error.light",
                        borderRadius: 4,
                      }}
                    >
                      <Typography
                        variant="h5"
                        color={isConnected ? "success.main" : "error.main"}
                        sx={{ fontWeight: "bold" }}
                      >
                        {isConnected ? "Terhubung" : "Terputus"}
                      </Typography>
                    </Paper>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              sx={{
                minWidth: { xs: "100%", sm: "250px" },
                maxWidth: { xs: "100%", sm: "300px" },
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <MessageIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                    <Typography variant="h6">Pesan Masuk</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {stats.incomingMessages}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {stats.incomingMessagesChange > 0 ? (
                      <TrendingUpIcon color="success" />
                    ) : (
                      <TrendingDownIcon color="error" />
                    )}
                    <Typography
                      variant="body2"
                      color={
                        stats.incomingMessagesChange > 0
                          ? "success.main"
                          : "error.main"
                      }
                      sx={{ ml: 0.5 }}
                    >
                      {Math.abs(stats.incomingMessagesChange)}% dari kemarin
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              sx={{
                minWidth: { xs: "100%", sm: "250px" },
                maxWidth: { xs: "100%", sm: "300px" },
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <SendIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                    <Typography variant="h6">Pesan Keluar</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {stats.outgoingMessages}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {stats.outgoingMessagesChange > 0 ? (
                      <TrendingUpIcon color="success" />
                    ) : (
                      <TrendingDownIcon color="error" />
                    )}
                    <Typography
                      variant="body2"
                      color={
                        stats.outgoingMessagesChange > 0
                          ? "success.main"
                          : "error.main"
                      }
                      sx={{ ml: 0.5 }}
                    >
                      {Math.abs(stats.outgoingMessagesChange)}% dari kemarin
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              sx={{
                minWidth: { xs: "100%", sm: "250px" },
                maxWidth: { xs: "100%", sm: "300px" },
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <GroupIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                    <Typography variant="h6">Pelanggan Aktif</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {stats.activeCustomers}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {stats.activeCustomersChange > 0 ? (
                      <TrendingUpIcon color="success" />
                    ) : (
                      <TrendingDownIcon color="error" />
                    )}
                    <Typography
                      variant="body2"
                      color={
                        stats.activeCustomersChange > 0
                          ? "success.main"
                          : "error.main"
                      }
                      sx={{ ml: 0.5 }}
                    >
                      {Math.abs(stats.activeCustomersChange)}% dari kemarin
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              sx={{
                flex: 1,
                width: '100%'
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent
                  sx={{
                    height: "100%",
                    width: "100%"
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    10 Pesan Terbaru
                  </Typography>
                  <DataGrid
                    rows={recentMessages}
                    columns={[
                      {
                        field: "timestamp",
                        headerName: "Waktu",
                        width: 200,
                        flex: 0.2,
                      },
                      {
                        field: "sender",
                        headerName: "Pengirim",
                        width: 200,
                        flex: 0.2,
                      },
                      {
                        field: "message",
                        headerName: "Pesan",
                        flex: 0.4,
                        minWidth: 300,
                      },
                      {
                        field: "status",
                        headerName: "Status",
                        width: 120,
                        flex: 0.2,
                        renderCell: (params) => (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              bgcolor:
                                params.value === "terkirim"
                                  ? "success.light"
                                  : params.value === "dibaca"
                                  ? "info.light"
                                  : "error.light",
                              px: 2,
                              py: 0.5,
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              color={
                                params.value === "terkirim"
                                  ? "success.main"
                                  : params.value === "dibaca"
                                  ? "info.main"
                                  : "error.main"
                              }
                            >
                              {params.value.charAt(0).toUpperCase() +
                                params.value.slice(1)}
                            </Typography>
                          </Box>
                        ),
                      },
                    ]}
                    autoHeight
                    initialState={{
                      pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                    loading={!isConnected}
                    sx={{
                      width: "100%",
                      minHeight: "350px",
                      "& .MuiDataGrid-cell": {
                        whiteSpace: "normal",
                        lineHeight: "normal",
                        padding: "8px",
                      },
                    }}
                    slots={{
                      noRowsOverlay: () => (
                        <Box
                          sx={{
                            display: "flex",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography>Tidak ada pesan terbaru</Typography>
                        </Box>
                      ),
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
