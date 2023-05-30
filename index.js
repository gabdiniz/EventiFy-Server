const cors = require("cors");
require("dotenv").config();
const express = require("express");
const { connection, authenticate } = require("./db/db");

const authRoutes = require("./routes/auth.routes");
const routeLocations = require("./routes/locations");
const routeUsers = require("./routes/users");
const routeEvets = require("./routes/events");
const routeSpeakers = require("./routes/speakers");
const routeFriendships = require("./routes/friendships");
const routePosts = require("./routes/posts")
const routeTalks = require("./routes/talks");
const routeRegistration = require("./routes/registrations");
const { errors } = require('celebrate');
const routeEventSpeakers = require("./routes/eventSpeakers");
const routeMessages = require("./routes/messages");
const routeMedias = require("./routes/medias");
const routeAdmins = require("./routes/admins");
const routeOrganizadores = require("./routes/organizadores");
const routeSuperAdmin = require("./routes/superadmin");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Definir as rotas
app.use('/auth', authRoutes);
app.use(routeLocations);
app.use(routeUsers);
app.use(routeEvets);
app.use(routeSpeakers);
app.use(routeFriendships);
app.use(routePosts);
app.use(routeTalks);
app.use(routeRegistration);
app.use(routeEventSpeakers);
app.use(routeMessages);
app.use(routeMedias);
app.use(routeAdmins);
app.use(routeOrganizadores);
app.use(routeSuperAdmin);

app.use(errors());
authenticate(connection);
connection.sync();

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001/");
});