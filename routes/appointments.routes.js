const express = require("express");

const { AppointmentModel } = require("../model/Appoinments.model");
const { auth } = require("../middleware/auth.middleware");
const appointmentRouter = express.Router();

appointmentRouter.get("/", auth, async (req, res) => {
  try {
    let { page, limit, specialization, order, name } = req.query;
    let filters = {};

    if (specialization) {
      filters.specialization = specialization;
    }

    if (name) {
      filters.name = name;
    }

    let sortOptions = {};

    if (order === "asc") {
      sortOptions.date = 1;
    } else if (order === "desc") {
      sortOptions.date = -1;
    }

    const appointments = await AppointmentModel
      .find(filters)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalAppointments = await AppointmentModel.countDocuments(filters);

    const totalPages = Math.ceil(totalAppointments / limit);

    res.send({ data: appointments, totalPages });
  } catch (error) {
    console.log(error);
    res.send({ msg: "Error in Getting Appointment " });
  }
});

appointmentRouter.post("/appointments", auth, async (req, res) => {
  try {
    const appointment = req.body;

    const date = new Date();
    const isoString = date.toISOString();
    appointment.date = isoString;

    let Appointment = new AppointmentModel(appointment);
    await Appointment.save();
    res.send({ msg: "Appointment Created" });
  } catch (error) {
    console.log(error);
    res.send({ msg: "Error in Appointment Creating" });
  }
});

appointmentRouter.patch(`/book/:id`, auth, async (req, res) => {
  try {
    const id = req.params.id;

    let Appointment = await AppointmentModel.findById(id);
    if (Appointment.slots >= 1) {
      await AppointmentModel.findByIdAndUpdate(id, {
        slots: Appointment.slots - 1,
      });

      res.send({ msg: "Appointment Booked successfully" });
    } else {
      res.send({ msg: "Slots are Not Available" });
    }
  } catch (error) {
    console.log(error);
    res.send({ msg: "Error in Appointment Booking" });
  }
});

module.exports = { appointmentRouter };