var express = require('express');
var router = express.Router();
var sdk = require("@ory/client")

var ory = new sdk.FrontendApi(
  new sdk.Configuration({
    basePath:
      process.env.ORY_SDK_URL || "https://playground.projects.oryapis.com",
    baseOptions: {
      // Ensures that cookies are included in CORS requests:
      withCredentials: true,
    }
  }),
);

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });

  console.log(process.env.ORY_SDK_URL);
  ory
    .toSession({ cookie: req.header("cookie") })
    .then(({ data: session }) => {
      res.render("index", {
        title: "Express",
        // Our identity is stored in the session along with other useful information.
        identity: session.identity,
      })
    })
    .catch(() => {
      // If logged out, send to login page
      // res.redirect("/.ory/ui/login")
      // Redirect to ORY's login page if session is invalid or absent
      const loginUrl = `${ory.configuration.basePath}/self-service/login/browser`;
      res.redirect(loginUrl);
    })
});


module.exports = router;
