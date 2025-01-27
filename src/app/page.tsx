"use client"; // Add this directive at the top of your component

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Home from "./home/page";

// Validation Schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  contact: Yup.string()
    .matches(/^[0-9]{10}$/, "Contact number must be exactly 10 digits")
    .required("Contact number is required"),
  eventDescription: Yup.string().required("Event description is required"),
  boxesRequired: Yup.number()
    .positive("Boxes required must be a positive number")
    .required("Boxes required is required")
    .integer("Boxes required must be an integer"),
});

const App = () => {
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  // Form submit handler to send data to backend
  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch('http://65.1.3.24:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Order placed successfully');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      setSubmissionStatus("Error placing order. Please try again.");
    }
  };


  return (
    <div>
      <Home />
      <Formik
        initialValues={{
          name: "",
          contact: "",
          eventDescription: "",
          boxesRequired: 1,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="flex flex-col gap-6 max-w-lg w-full bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
          <h1 className="text-lg font-bold">Direct Order Here </h1>
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Name
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              className="mt-2 p-2 w-full border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-white dark:border-gray-700"
              placeholder="Enter your name"
            />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Contact
            </label>
            <Field
              id="contact"
              name="contact"
              type="tel"
              className="mt-2 p-2 w-full border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-white dark:border-gray-700"
              placeholder="Enter your contact number"
            />
            <ErrorMessage name="contact" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label htmlFor="event-description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Describe your event
            </label>
            <Field
              id="event-description"
              name="eventDescription"
              as="textarea"
              className="mt-2 p-2 w-full border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-white dark:border-gray-700"
              placeholder="Tell us about your event"
              rows={4}
            />
            <ErrorMessage name="eventDescription" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label htmlFor="boxes-required" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Boxes Required
            </label>
            <Field
              id="boxes-required"
              name="boxesRequired"
              type="number"
              className="mt-2 p-2 w-full border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-white dark:border-gray-700"
              placeholder="Enter number of boxes"
            />
            <ErrorMessage name="boxesRequired" component="div" className="text-red-500 text-sm" />
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit
          </button>

          {submissionStatus && (
            <div className={`mt-4 text-center text-sm ${submissionStatus.includes("Error") ? "text-red-500" : "text-green-500"}`}>
              {submissionStatus}
            </div>
          )}
        </Form>
      </Formik>
    </div>
  );
};

export default App;
