
const parseTags =  async (req, res, next) => {
  try {

      const tagValues = [];
      tagValues.push(req.body.tag1);
      tagValues.push(req.body.tag2);
      tagValues.push(req.body.tag3);
      const tags = [];
      for (let i = 0; i < 3; i++) {
        if (tagValues[i] !== "") {
          tags.push(tagValues[i]);
        }
      }
      req.body.tags = tags;
    } catch(err) {
      console.log(err);
    }
    next();
}

module.exports = parseTags;