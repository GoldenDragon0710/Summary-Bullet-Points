import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Navbar as MTNavbar,
  Typography,
} from "@material-tailwind/react";

export function Navbar({ brandName }) {

  return (
    <MTNavbar color="transparent" className="p-3">
      <Link to="/">
        <Typography className="mr-4 ml-2 cursor-pointer py-1.5 font-bold">
          {brandName}
        </Typography>
      </Link>
    </MTNavbar>
  );
}

Navbar.defaultProps = {
  brandName: "Generative Bullet Points",
};

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Navbar.displayName = "/src/widgets/layout/navbar.jsx";

export default Navbar;
