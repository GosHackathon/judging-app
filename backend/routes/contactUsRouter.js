const express = require('express');
const router = express.Router();
const ContactUsModel =  require("../models/ContactUs")

router.post('/', async (req, res) => {
  const { firstName, lastName, school, phone, email, message, categories, otherAnswer } = req.body;

  try {
      // Create a new ContactUs document
      const contact = new ContactUsModel({
          firstName,
          lastName,
          school,
          phone,
          email,
          message,
          categories,
          otherAnswer
      });

      // Save the document in the database
      await contact.save();

      // Respond with success message
      res.status(201).json({
          message: 'Contact form data saved successfully',
          data: contact
      });
  } catch (error) {
      res.status(500).json({
          message: 'Error saving contact data',
          error
      });
  }
});

module.exports = router;