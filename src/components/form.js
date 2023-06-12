import React, { useState, useEffect } from "react";
import data from "./data.json";
import "./form.css";
const RegistrationForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [city, setcity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [tableData, setTableData] = useState([]);
  const [state, setstate] = useState("");
  const [selectedState, setSelectedState] = useState("");
  useEffect(() => {
    setStateOptions(data.states);
  }, []);

  useEffect(() => {
    if (selectedState) {
      setCityOptions(data.cities[selectedState]);
    } else {
      setCityOptions([]);
    }
  }, [selectedState]);

  const handlePhoneNumberChange = (event) => {
    const inputPhoneNumber = event.target.value
      .replace(/\D/g, "")
      .substring(0, 10); // Remove non-digits and limit to 10 digits
    const formattedPhoneNumber = formatPhoneNumber(inputPhoneNumber);
    setPhoneNumber(formattedPhoneNumber);
  };

  const formatPhoneNumber = (phoneNumber) => {
    const phoneNumberArray = phoneNumber.split("");
    if (phoneNumberArray.length > 3) phoneNumberArray.splice(3, 0, "-");
    if (phoneNumberArray.length > 7) phoneNumberArray.splice(7, 0, "-");
    return phoneNumberArray.join("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date();
    const selectedDate = new Date(dob);
    const ageDiff = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    const dayDiff = today.getDate() - selectedDate.getDate();
    if (
      ageDiff < 21 ||
      (ageDiff === 21 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
    ) {
      alert("You must be at least 21 years old.");
      return;
    }
    const formData = {
      firstName,
      lastName,
      state,
      city,
      phoneNumber,
      dob,
    };

    fetch("https://localhost:7211/api/CURD", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setTableData(data);
      })
      .catch((error) => {
        console.log(error);
      });

    window.location.reload();
  };

  useEffect(() => {
    fetch("https://localhost:7211/api/CURD", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setTableData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div>
      <h2>FORM</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            maxLength={12} // Maximum 12 characters (including dashes)
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            value={dob}
            onChange={(event) => setDob(event.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="state">State:</label>
          <select
            id="state"
            value={state}
            onChange={(e) => {
              console.log(e);
              setSelectedState(e.target.selectedIndex);
              setstate(e.target.value);
            }}
          >
            <option value="">Select a state</option>
            {stateOptions.map((state) => (
              <option key={state.id} value={state.name} id={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label htmlFor="city">City:</label>
          <select
            id="city"
            value={city}
            onChange={(e) => setcity(e.target.value)}
            disabled={!selectedState}
          >
            <option value="">Select a city</option>
            {cityOptions.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <br />
        <button type="submit">Submit</button>
      </form>
      <br />
      <table>
        <thead>
          <tr>
            <th>FirstName</th>
            <th>LastName</th>
            <th>PhoneNumber</th>
            <th>State</th>
            <th>City</th>
            <th>DOB</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data) => (
            <tr key={data.id}>
              <td>{data.firstname}</td>
              <td>{data.lastname}</td>
              <td>{data.phoneNumber}</td>
              <td>{data.state}</td>
              <td>{data.city}</td>
              <td>{data.dob}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistrationForm;
