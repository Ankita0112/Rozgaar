class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async createUser(req, res, next) {
    const {
      username,
      phoneNumber,
      aadharNumber,
      category,
      YOE,
      otherSkills,
      currentLocation,
      availability,
      messageForRecruiter,
    } = req.body;

    console.log("Reached controller");
    console.log(req.body);
    try {
      const user = await this.userService.createUser(
        username,
        phoneNumber,
        aadharNumber,
        category,
        YOE,
        otherSkills,
        currentLocation,
        availability,
        messageForRecruiter
      );
      return res.status(201).json({
        data: user,
      });
    } catch (err) {
      console.log("Error being sent from backend", err);
      // Handle duplicate aadhar error thrown by manager
      if (err && err.code === "DUPLICATE_AADHAR") {
        return res.status(409).json({ error: "A user with this Aadhar number already exists" });
      }
      // Handle Mongo duplicate key (in case it slipped through)
      if (err && err.code === 11000 && err.keyValue && err.keyValue.aadharNumber) {
        return res.status(409).json({ error: `A user with aadharNumber ${err.keyValue.aadharNumber} already exists` });
      }
      return res.status(400).json({ error: err && err.message ? err.message : err });
    }
  }
}

module.exports = UserController;
