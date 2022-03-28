
const getAddPage = (req, res) => {
    res.render('add');
}

const getAboutPage = (req, res) => {
    res.render('about');
  }

module.exports = {
    getAddPage,
    getAboutPage
}