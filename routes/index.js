var express = require('express');
const contact = require('../Models/contact');
var app = express();
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard',loggedIn, function (req, res, next) {
  contact.find({}, (err, tasks) => {
    res.render('dashboard', { data: tasks });
  })
});

router.post('/addcontact', (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;


  const newcontact = new contact({
    name,
    phone,
    email
  });
  newcontact.save();

  res.redirect('/dashboard');
});

router.get('/delete/:id' , (req,res) => {
  const id = req.params.id;
  contact.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/dashboard");
  });
});

router.route('/edit/:id')
  .get((req, res) => {
    const id = req.params.id;
    contact.findById(id, (err, tasks) => {
      if (err) return res.send(500, err);
      res.render('updateform', { data: tasks })
    })
  })
        .post((req, res) => {
          const id = req.params.id;
          contact.findByIdAndUpdate(id, {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email
          }).catch(err => console.log(err));
          res.redirect("/dashboard");
        });

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
}


module.exports = router;
