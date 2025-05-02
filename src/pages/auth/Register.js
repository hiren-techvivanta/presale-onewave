import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { customList } from "country-codes-list";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const countryObj = customList(
    "countryCode",
    "{countryNameEn} (+{countryCallingCode})"
  );
  const countries = Object.entries(countryObj).map(([code, name]) => ({
    code,
    name,
  }));
  const callingCodeMap = customList("countryCode", "{countryCallingCode}");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    phone: "",
    refEmail: "",
    password: "",
    rePassword: "",
    agree: false,
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [errors, setErrors] = useState({});
  const [country, setcountry] = useState();

  const nameCharRegex = /^[a-zA-Z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{5,15}$/;

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedObject = JSON.parse(user);
    const objectArray = [parsedObject];
    if (objectArray[0] !== null) {
      navigate("/presale");
    }
  }, []);

  const validateStepOne = () => {
    const newErrors = {};

    if (
      !form.firstName ||
      form.firstName.length < 2 ||
      form.firstName.length > 50
    ) {
      newErrors.firstName = "First name must be 2-50 characters.";
    } else if (!nameCharRegex.test(form.firstName)) {
      newErrors.firstName = "First name should not contain special characters.";
    }

    if (
      !form.lastName ||
      form.lastName.length < 2 ||
      form.lastName.length > 50
    ) {
      newErrors.lastName = "Last name must be 2-50 characters.";
    } else if (!nameCharRegex.test(form.lastName)) {
      newErrors.lastName = "Last name should not contain special characters.";
    }

    if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!form.country) {
      newErrors.country = "Country is required.";
    }

    if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "Phone must be 5-15 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors = {};
    if (!form.password || form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (form.password !== form.rePassword) {
      newErrors.rePassword = "Passwords do not match.";
    }
    if (!form.agree) {
      newErrors.agree = "You must agree to the terms.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;

    if (name === "country") {
      setcountry(value);
      value = value.split(" ")[0];
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validateStepOne()) {
      setShowPasswordFields(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStepTwo()) {
      console.log("Registration form submitted:", form);
      const formData = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: +form.phone,
        email: form.email,
        password: form.password,
        nationality: form.country,
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/register`,
        formData
      );

      if (data.status === true) {
        toast.success(data.message);
        navigate("/signup/verify/otp");
      }
    }
  };

  return (
    <>
      <div className="blur-bg py-3 px-4 d-flex justify-content-between align-items-center w-100 shadow-sm position-absolute top-0">
        <img
          src={logo}
          alt="Wave Logo"
          className="img-fluid"
          style={{ maxWidth: "120px" }}
        />
        <button
          className="btn btn-primary px-4"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </button>
      </div>

      <div className="register-page position-relative vh-100">
        <div className="position-absolute w-100 h-100 bg-dark bg-opacity-10"></div>

        <div className="position-absolute translate-centrt w-100 mw-100 px-3">
          <div
            className="login-box shadow-lg rounded-3 bg-white "
            style={{ maxWidth: "450px" }}
          >
            <div className="pt-2 px-3 pb-0">
              <h2 className="fw-semibold">
                Sign up to <span className="text-primary">Wave</span>
              </h2>
              <p className="text-secondary mb-4">
                Create account today and start using Wave
              </p>
            </div>
            <hr className="my-1" />

            <form
              className="pt-2 pb-3 px-3"
              onSubmit={showPasswordFields ? handleSubmit : handleContinue}
            >
              {!showPasswordFields && (
                <>
                  <div className="d-flex gap-2">
                    <div className="mb-2 w-50">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.firstName ? "is-invalid" : ""
                        }`}
                        placeholder="Your First Name"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                      />
                      {errors.firstName && (
                        <div className="invalid-feedback">
                          {errors.firstName}
                        </div>
                      )}
                    </div>

                    <div className="mb-2 w-50">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.lastName ? "is-invalid" : ""
                        }`}
                        placeholder="Your Last Name"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                      />
                      {errors.lastName && (
                        <div className="invalid-feedback">
                          {errors.lastName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Your Email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Country</label>
                    <select
                      className={`form-control ${
                        errors.country ? "is-invalid" : ""
                      }`}
                      name="country"
                      onChange={handleChange}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <div className="invalid-feedback">{errors.country}</div>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Phone</label>
                    <div className="input-group">
                      <input
                        type="tel"
                        className={`form-control ${
                          errors.phone ? "is-invalid" : ""
                        }`}
                        placeholder="Your Phone No"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && (
                        <div className="invalid-feedback">{errors.phone}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Referral Id (optional)</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.refEmail ? "is-invalid" : ""
                      }`}
                      placeholder="Referral Email"
                      name="refEmail"
                      value={form.refEmail}
                      onChange={handleChange}
                    />
                    {errors.refEmail && (
                      <div className="invalid-feedback">{errors.refEmail}</div>
                    )}
                  </div>
                </>
              )}

              {showPasswordFields && (
                <>
                  <div className="mb-2 position-relative">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      name="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                    />
                    {/* <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`} />
                    </button> */}
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Re-enter Password</label>
                    <input
                      type="password"
                      className={`form-control ${
                        errors.rePassword ? "is-invalid" : ""
                      }`}
                      placeholder="Re Enter Password"
                      name="rePassword"
                      value={form.rePassword}
                      onChange={handleChange}
                    />
                    {errors.rePassword && (
                      <div className="invalid-feedback">
                        {errors.rePassword}
                      </div>
                    )}
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="agree"
                      id="agree"
                      checked={form.agree}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="agree">
                      I agree to the{" "}
                      <Link to="/" className="text-decoration-none">
                        {" "}
                        terms and conditions
                      </Link>
                    </label>
                    {errors.agree && (
                      <div className="invalid-feedback d-block">
                        {errors.agree}
                      </div>
                    )}
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-primary w-100 py-2">
                {showPasswordFields ? "Register" : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
