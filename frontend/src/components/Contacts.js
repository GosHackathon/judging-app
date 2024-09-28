import React, { useState } from 'react';
import './Contacts.css'; // Importing the separate CSS file
import { saveContactUsForm } from '../services/apiService'; // Ensure the correct path to your API service

const Contacts = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    school: '',
    phone: '',
    email: '',
    message: '',
    categories: {
      goshowcase: false,
      goshackathon: false,
      volunteer: false,
      sponsor: false,
      other: false,
    },
    otherAnswer: '',
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false); // Success message state
  const [submitError, setSubmitError] = useState(''); // Error message state

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        categories: {
          ...formData.categories,
          [name]: checked,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = 'First Name is required';
    if (!formData.lastName) errors.lastName = 'Last Name is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});

      const contactData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        school: formData.school,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        categories: formData.categories,
        otherAnswer: formData.otherAnswer,
      };

      try {
        // API call to save the contact form
        await saveContactUsForm(contactData);
        setSubmitSuccess(true); // Set success flag
        setSubmitError(''); // Clear any previous errors
        console.log('Form Submitted:', contactData);
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitError('There was an error submitting the form. Please try again.');
        setSubmitSuccess(false); // Set failure flag
      }
    }
  };

  return (
    <div className="contacts-component">
      <div>
        {/* Contact Section */}
        <section className="contact">
          <h2>Contact the GoSH Crew!</h2>
          <p>
            Get in touch via the form below or talk to the GoSH Crew at the upcoming event!
          </p>
          <p>
            If you have enquiries about Registration for the upcoming PEEL GoSHACKATHON, please fill the
            Registration online or at the registration desk, and talk to the crew at the event.
          </p>
  
          {/* Contact Form */}
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <p className="error-message">{errors.firstName}</p>}
              </div>
  
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <p className="error-message">{errors.lastName}</p>}
              </div>
  
              <div className="form-group">
                <label htmlFor="school">School / Business / Organisation Name</label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>
  
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
  
              <div className="form-group-contactus">
                <label>Which Category are you interested in?</label>
                <div>
                  <input
                    type="checkbox"
                    id="goshowcase"
                    name="goshowcase"
                    checked={formData.categories.goshowcase}
                    onChange={handleChange}
                  />
                  <label htmlFor="goshowcase"> GoSHowcase</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="goshackathon"
                    name="goshackathon"
                    checked={formData.categories.goshackathon}
                    onChange={handleChange}
                  />
                  <label htmlFor="goshackathon"> GoSHackathon</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="volunteer"
                    name="volunteer"
                    checked={formData.categories.volunteer}
                    onChange={handleChange}
                  />
                  <label htmlFor="volunteer"> Volunteer</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="sponsor"
                    name="sponsor"
                    checked={formData.categories.sponsor}
                    onChange={handleChange}
                  />
                  <label htmlFor="sponsor"> Sponsor</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="other"
                    name="other"
                    checked={formData.categories.other}
                    onChange={handleChange}
                  />
                  <label htmlFor="other"> Other</label>
                </div>
                <input
                  type="text"
                  id="other-answer"
                  name="otherAnswer"
                  value={formData.otherAnswer}
                  onChange={handleChange}
                  placeholder="Add answer here"
                />
              </div>
  
              {/* Show any validation errors */}
              {Object.keys(errors).length > 0 && (
                <div className="error-summary">
                  <p>Please correct the highlighted errors before submitting.</p>
                </div>
              )}
  
              {/* Success and Error Messages */}
              {submitSuccess && <p className="success-message">Form submitted successfully!</p>}
              {submitError && <p className="error-message">{submitError}</p>}
  
              <button type="submit">Send</button>
            </form>
  
            <div className="social-media">
              <p>Social Media</p>
              <a href="https://www.facebook.com/share/15BN1pESWB/?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
                <img src="../facebook-icon.png" alt="Facebook" />
              </a>
              <a href="https://www.instagram.com/goshackathon/" target="_blank" rel="noopener noreferrer">
                <img src="../instagram-icon.png" alt="Instagram" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default Contacts;
