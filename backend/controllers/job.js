class JobController {
  constructor(jobService) {
    this.jobService = jobService;
  }

  async getAllJobs(req, res) {
    const category = req.query.CATEGORY;
    console.log("Reached controller");
    console.log(category);
    try {
      let allJobs = await this.jobService.getAllJobs(category);
      console.log("Result from controller", allJobs);
      return res.status(201).json({
        jobs: allJobs,
      });
    } catch (err) {
      console.log("ERROR IN getAllJobs JOBCONTROLLER");
      return res.status(500).send(err);
    }
  }

  async createJob(req, res) {
    const {
      title,
      recruiterEmailId,
      recruiterPhoneNumber,
      category,
      description,
      location,
      offeredSalary,
      numberOfPositions,
    } = req.body;

    console.log("Reached controller");
    console.log(req.body);
    try {
      // Basic server-side validation and coercion
      const errors = [];

      const cleanTitle = typeof title === "string" ? title.trim() : "";
      if (!cleanTitle || cleanTitle.length < 5) {
        errors.push({ field: "title", message: "Title must be at least 5 characters" });
      }

      const cleanLocation = typeof location === "string" ? location.trim() : "";
      if (!cleanLocation || cleanLocation.length < 2) {
        errors.push({ field: "location", message: "Location must be at least 2 characters" });
      }

      const phone = typeof recruiterPhoneNumber === "string" ? recruiterPhoneNumber.trim() : "";
      if (!/^\d{10}$/.test(phone)) {
        errors.push({ field: "recruiterPhoneNumber", message: "Enter a valid 10 digit phone number" });
      }

      // offeredSalary and numberOfPositions should be numeric
      let salary = undefined;
      if (offeredSalary !== undefined && offeredSalary !== null && offeredSalary !== "") {
        salary = Number(offeredSalary);
        if (isNaN(salary)) errors.push({ field: "offeredSalary", message: "Offered salary must be a number" });
      }

      let positions = undefined;
      if (numberOfPositions !== undefined && numberOfPositions !== null && numberOfPositions !== "") {
        positions = parseInt(numberOfPositions, 10);
        if (isNaN(positions) || positions < 1) errors.push({ field: "numberOfPositions", message: "Number of positions must be a positive integer" });
      }

      if (errors.length) {
        return res.status(400).json({ errors });
      }

      const job = await this.jobService.createJob(
        cleanTitle,
        recruiterEmailId && recruiterEmailId.trim(),
        phone,
        category,
        description,
        cleanLocation,
        salary,
        positions
      );

      return res.status(201).json({ data: job });
    } catch (err) {
      console.log("Error being sent from backend", err);
      // If it's a mongoose validation error, send structured info
      if (err && err.errors) {
        return res.status(400).json({ errors: err.errors });
      }
      return res.status(500).json({ error: err && err.message ? err.message : err });
    }
  }

  async getAllCandidates(req, res) {
    const category = req.query.CATEGORY;
    console.log("controller", category);
    try {
      let allCandidates = await this.jobService.getAllCandidates(category);
      return res.status(200).json({
        candidates: allCandidates,
      });
    } catch (err) {
      console.log("ERROR IN getAllCandidates JOBCONTROLLER");
      return res.status(500).send(err);
    }
  }

  async applyToAJob(req, res) {
    let job_id = req.params.job_id,
      aadharNumber = req.body.aadharNumber;
    console.log("Controller", job_id, aadharNumber);
    try {
      await this.jobService.applyToAJob(job_id, aadharNumber);
      return res.status(200).send("Your application has been sent");
    } catch (err) {
      console.log("ERROR IN applyjob JOBCONTROLLER");
      return res.status(500).send(err);
    }
  }
}

module.exports = JobController;
