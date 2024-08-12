// src/components/Form.js
import React, { useState } from "react";

const Form = () => {
  const categories = [
    "Explain the Problem",
    "Solution Benefits",
    "Application of STEM",
    "Presentation",
  ];
  const ratings = ["Not OK", "Just OK", "Alright", "Pretty Good", "Great"];

  const [numOrganizations, setNumOrganizations] = useState(2);
  const [organizations, setOrganizations] = useState(
    Array.from({ length: numOrganizations }, (_, i) => `Organization ${i + 1}`)
  );
  const [formState, setFormState] = useState(
    Array.from(
      { length: numOrganizations },
      (_, i) => `Organization ${i + 1}`
    ).reduce((orgAcc, org) => {
      orgAcc[org] = categories.reduce((catAcc, category) => {
        catAcc[category] = "";
        return catAcc;
      }, {});
      return orgAcc;
    }, {})
  );

  const handleNumOrganizationsChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumOrganizations(count);

    const newOrganizations = Array.from(
      { length: count },
      (_, i) => `Organization ${i + 1}`
    );
    setOrganizations(newOrganizations);

    const newFormState = newOrganizations.reduce((orgAcc, org) => {
      orgAcc[org] = categories.reduce((catAcc, category) => {
        catAcc[category] = "";
        return catAcc;
      }, {});
      return orgAcc;
    }, {});

    setFormState(newFormState);
  };

  const handleOrganizationChange = (index, newName) => {
    const updatedOrganizations = [...organizations];
    updatedOrganizations[index] = newName;
    setOrganizations(updatedOrganizations);

    const newFormState = updatedOrganizations.reduce((orgAcc, org) => {
      orgAcc[org] = categories.reduce((catAcc, category) => {
        catAcc[category] = "";
        return catAcc;
      }, {});
      return orgAcc;
    }, {});

    setFormState(newFormState);
  };

  const handleRadioChange = (org, category, rating) => {
    setFormState((prevState) => ({
      ...prevState,
      [org]: {
        ...prevState[org],
        [category]: rating,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with values:", formState);
    // Implement API call to submit form data here
  };

  return (
    <div>
      <label>
        Number of Organizations:
        <input
          type="number"
          value={numOrganizations}
          onChange={handleNumOrganizationsChange}
          min="1"
        />
      </label>
      <form onSubmit={handleSubmit}>
        {organizations.map((org, orgIndex) => (
          <div key={orgIndex}>
            <h3>
              <input
                type="text"
                value={org}
                onChange={(e) =>
                  handleOrganizationChange(orgIndex, e.target.value)
                }
              />
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Categories</th>
                  {ratings.map((rating, ratingIndex) => (
                    <th key={ratingIndex}>{rating}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((category, categoryIndex) => (
                  <tr key={categoryIndex}>
                    <td>{category}</td>
                    {ratings.map((rating, ratingIndex) => (
                      <td key={ratingIndex}>
                        <input
                          type="radio"
                          id={`${org}-${category}-${rating}`}
                          name={`${org}-${category}`} // Ensures each radio button in a category is part of a group
                          value={rating}
                          checked={formState[org][category] === rating}
                          onChange={() =>
                            handleRadioChange(org, category, rating)
                          }
                        />
                        <label htmlFor={`${org}-${category}-${rating}`}></label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
