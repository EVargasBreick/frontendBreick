import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs"; // Icons for showing/hiding password

function PasswordInput() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      login(); // Replace this with your login logic
    }
  };

  return (
    <InputGroup className="mb-3">
      <Form.Control
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Password"
      />
      <InputGroup.Append>
        <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
          {showPassword ? <BsEyeSlash /> : <BsEye />}
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
}
