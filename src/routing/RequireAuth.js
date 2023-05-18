import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../Firebase/Firebase";

function RequireAuth() {
  let user = auth.currentUser;

  if (!user) {
    console.log("back to login");
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default RequireAuth;
